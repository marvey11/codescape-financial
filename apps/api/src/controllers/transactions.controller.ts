import { AddTransactionDTO } from "@csfin/core";
import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Body, Get, JsonController, Param, Post, Res } from "routing-controllers";
import { Service } from "typedi";
import { TransactionService } from "../services";

@Service()
@JsonController()
export class TransactionController {
  constructor(private service: TransactionService) {}

  @Get("/accounts/:id/transactions")
  async getAll(@Res() response: Response, @Param("id") accountID: number): Promise<Response> {
    return this.service
      .getAll(accountID)
      .then((transactions) => response.status(StatusCodes.OK).send(transactions))
      .catch((error) => response.status(StatusCodes.BAD_REQUEST).send({ message: error.message }));
  }

  @Get("/accounts/:id/transactions/:isin")
  async getAllByISIN(
    @Res() response: Response,
    @Param("id") accountID: number,
    @Param("isin") isin: string
  ): Promise<Response> {
    return this.service
      .getAllByISIN(accountID, isin)
      .then((transactions) => response.status(StatusCodes.OK).send(transactions))
      .catch((error) => response.status(StatusCodes.BAD_REQUEST).send({ message: error.message }));
  }

  @Post("/accounts/:id/transactions")
  async addOne(
    @Res() response: Response,
    @Param("id") accountID: number,
    @Body({ required: true }) data: AddTransactionDTO
  ): Promise<Response> {
    return this.service
      .addOne(accountID, data)
      .then((result) => response.status(StatusCodes.CREATED).send(result))
      .catch((error) => response.status(StatusCodes.BAD_REQUEST).send({ message: error.message }));
  }
}
