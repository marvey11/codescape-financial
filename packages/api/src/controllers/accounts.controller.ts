import { CreateAccountDTO } from "@csfin/core";
import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Body, Get, JsonController, Param, Post, Res } from "routing-controllers";
import { Service } from "typedi";
import { AccountService } from "../services";

@Service()
@JsonController()
export class AccountController {
  constructor(private service: AccountService) {}

  @Get("/accounts")
  async getAll(@Res() response: Response): Promise<Response> {
    return this.service
      .getAll()
      .then((accounts) => response.status(StatusCodes.OK).send(accounts))
      .catch((error) => response.status(StatusCodes.BAD_REQUEST).send({ message: error.message }));
  }

  @Get("/accounts/:id")
  async getOne(@Res() response: Response, @Param("id") id: number): Promise<Response> {
    return this.service
      .getOneByID(id)
      .then((account) => response.status(StatusCodes.OK).send(account))
      .catch((error) => response.status(StatusCodes.BAD_REQUEST).send({ message: error.message }));
  }

  @Post("/accounts")
  async addOne(@Body({ required: true }) data: CreateAccountDTO, @Res() response: Response): Promise<Response> {
    return this.service
      .addOne(data)
      .then((account) => response.status(StatusCodes.CREATED).send(account))
      .catch((error) => response.status(StatusCodes.BAD_REQUEST).send({ message: error.message }));
  }
}
