import { CreateExchangeDTO } from "@csfin/core";
import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Body, Get, JsonController, Post, Res } from "routing-controllers";
import { Service } from "typedi";
import { SecuritiesExchangeService } from "../services/exchanges.service";

@Service()
@JsonController()
export class SecuritiesExchangeController {
  constructor(private service: SecuritiesExchangeService) {}

  @Get("/exchanges")
  async getAll(@Res() response: Response): Promise<Response> {
    return this.service
      .getAll()
      .then((exchanges) => response.status(StatusCodes.OK).send(exchanges))
      .catch((error) => response.status(StatusCodes.BAD_REQUEST).send({ message: error.message }));
  }

  @Post("/exchanges")
  async addOne(@Body({ required: true }) data: CreateExchangeDTO, @Res() response: Response): Promise<Response> {
    return this.service
      .addOne(data)
      .then((exchange) => response.status(StatusCodes.CREATED).send(exchange))
      .catch((error) => response.status(StatusCodes.BAD_REQUEST).send({ message: error.message }));
  }
}
