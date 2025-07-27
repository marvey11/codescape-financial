import { Country } from "@codescape-financial/portfolio-data-access";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { CountryService } from "./country.service.js";

@Controller("countries")
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  async findAll(): Promise<Country[]> {
    return this.countryService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<Country | null> {
    return this.countryService.findOne(id);
  }

  @Post()
  async create(@Body() country: Country): Promise<Country> {
    return this.countryService.create(country);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() country: Country
  ): Promise<Country | null> {
    return this.countryService.update(id, country);
  }

  @Delete(":id")
  async remove(@Param("id") id: string): Promise<void> {
    await this.countryService.remove(id);
  }
}
