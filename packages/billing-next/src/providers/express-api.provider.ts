/* eslint-disable no-useless-constructor */
import { injectable, inject } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { IApiProvider } from '../interfaces/api.provider';
import { TYPES } from '../types';

@injectable()
export class ExpressApiProvider implements IApiProvider {
  // deps: mongoose, req, res
  constructor(@inject(Request) private req: Request) {}
}
