import { AddQuoteDataDTO } from "@csfin/core";
import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Body, Get, JsonController, Param, Post, Res } from "routing-controllers";
import { Service } from "typedi";
import { QuoteDataService } from "../services";

@Service()
@JsonController()
export class QuoteDataController {
  constructor(private service: QuoteDataService) {}

  @Get("/quotes/:isin/:exchange")
  async get(
    @Res() response: Response,
    @Param("isin") isin: string,
    @Param("exchange") exchange: string
  ): Promise<Response> {
    return this.service
      .get(isin, exchange)
      .then((result) => response.status(StatusCodes.OK).send(result))
      .catch((error) => response.status(StatusCodes.BAD_REQUEST).send({ message: error.message }));
  }

  @Post("/quotes")
  async add(@Body({ required: true }) data: AddQuoteDataDTO, @Res() response: Response): Promise<Response> {
    return this.service
      .add(data)
      .then((result) => response.status(StatusCodes.OK).send(result))
      .catch((error) => response.status(StatusCodes.BAD_REQUEST).send({ message: error.message }));
  }
}
