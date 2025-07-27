import { Country } from "@codescape-financial/portfolio-data-access";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Country)
    private countryRepository: Repository<Country>
  ) {}

  async findAll(): Promise<Country[]> {
    return this.countryRepository.find();
  }

  async findOne(id: string): Promise<Country | null> {
    return this.countryRepository.findOne({ where: { id } });
  }

  async create(country: Country): Promise<Country> {
    return this.countryRepository.save(country);
  }

  async update(id: string, country: Country): Promise<Country | null> {
    await this.countryRepository.update(id, country);
    return this.countryRepository.findOne({ where: { id } });
  }

  async remove(id: string): Promise<void> {
    await this.countryRepository.delete(id);
  }
}
