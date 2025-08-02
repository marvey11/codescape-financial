import { Country } from "@codescape-financial/portfolio-data-access";
import {
  CountryResponseDTO,
  CreateCountryDTO,
  UpdateCountryDTO,
} from "@codescape-financial/portfolio-data-models";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
  ) {}

  async findAll(): Promise<CountryResponseDTO[]> {
    return this.countryRepository
      .find()
      .then((countries) => countries.map(this.mapEntityToDto));
  }

  async findOne(id: string): Promise<CountryResponseDTO | null> {
    return this.countryRepository
      .findOne({ where: { id } })
      .then((country) => (country ? this.mapEntityToDto(country) : null));
  }

  async create(countryDto: CreateCountryDTO): Promise<CountryResponseDTO> {
    const { countryCode, ...rest } = countryDto;
    const newCountry = this.countryRepository.create({
      ...rest,
      isoCode: countryCode,
    });
    const savedCountry = await this.countryRepository.save(newCountry);
    return this.mapEntityToDto(savedCountry);
  }

  async update(
    countryId: string,
    countryUpdate: UpdateCountryDTO,
  ): Promise<CountryResponseDTO> {
    const countryToUpdate = await this.countryRepository.findOneBy({
      id: countryId,
    });
    if (!countryToUpdate) {
      throw new NotFoundException(`Country with ID "${countryId}" not found`);
    }

    // Destructure to separate `countryCode` (which requires special name mapping)
    // from the rest of the properties that can be merged directly.
    const { countryCode, ...rest } = countryUpdate;
    this.countryRepository.merge(countryToUpdate, rest);

    // Explicitly update `isoCode` from `countryCode` only if it was provided.
    // This is safer and clearer than relying on `merge` to ignore `undefined`.
    if (countryCode !== undefined) {
      countryToUpdate.isoCode = countryCode;
    }
    const savedCountry = await this.countryRepository.save(countryToUpdate);

    return this.mapEntityToDto(savedCountry);
  }

  async remove(id: string): Promise<void> {
    await this.countryRepository.delete(id);
  }

  private mapEntityToDto(country: Country): CountryResponseDTO {
    const { id, name, isoCode, withholdingTaxRate } = country;
    return {
      id,
      name,
      countryCode: isoCode,
      withholdingTaxRate,
    };
  }
}
