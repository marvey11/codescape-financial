import { AddSecurityDTO } from "@csfin/core";
import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Body, Get, JsonController, Param, Post, Res } from "routing-controllers";
import { Service } from "typedi";
import { SecuritiesService } from "../services";

@Service()
@JsonController()
export class SecuritiesController {
  constructor(private service: SecuritiesService) {}

  @Get("/securities")
  async getAll(@Res() response: Response): Promise<Response> {
    return this.service
      .getAll()
      .then((securities) => response.status(StatusCodes.OK).send(securities))
      .catch((error) => response.status(StatusCodes.BAD_REQUEST).send({ message: error.message }));
  }

  @Get("/securities/:isin")
  async getOne(@Param("isin") isin: string, @Res() response: Response): Promise<Response> {
    return this.service
      .getOneByISIN(isin)
      .then((security) => response.status(StatusCodes.OK).send(security))
      .catch((error) => response.status(StatusCodes.NOT_FOUND).send({ message: error.message }));
  }

  @Post("/securities")
  async addOne(@Body({ required: true }) data: AddSecurityDTO, @Res() response: Response): Promise<Response> {
    return this.service
      .addOne(data)
      .then((result) => response.status(StatusCodes.CREATED).send(result))
      .catch((error) => response.status(StatusCodes.BAD_REQUEST).send({ message: error.message }));
  }
}
