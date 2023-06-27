import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Request,
  Response,
  Res,
  HttpException,
  HttpCode,
} from '@nestjs/common';

import { AppService } from './app.service';
import { merge, MergeOptions } from './merge-util';
import { EvsViewConfig, MergeDTO, MergeResponse } from './mytypes';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): object {
    return this.appService.getGreeting();
  }

  @Post(`/merge`)
  @HttpCode(200)
  public async mergeModels(
    @Req() request: Request,
    @Res() response: Response,
    @Body() data: MergeDTO,
  ): Promise<MergeResponse> {
    console.log(`body:`, data);
    let merged: EvsViewConfig = data.model;
    if (merged == null || data.snippets == null || data.options == null) {
      // to be safe check, if at least options conforms to MergeOptions
      throw new HttpException(
        `Cannot process request data: ${JSON.stringify(data, undefined, 2)}`,
        400,
        {
          description: 'Something in the data is not correct',
        },
      );
    }

    try {
      merged = await this.mergeAll(merged, data.snippets, data.options);
    } catch (err) {
      throw new HttpException(
        `Error processing request data: ${JSON.stringify(data, undefined, 2)}`,
        500,
        {
          cause: err,
        },
      );
    }

    response.headers.append('Content-Type', 'application/json');
    return {
      mergedModel: merged,
      success: true,
    };
  }

  private async mergeAll(
    model: EvsViewConfig,
    snippets: object[],
    options: MergeOptions<any>,
  ): Promise<EvsViewConfig> {
    if (snippets.length <= 0) {
      return model;
    }
    const merged = await merge(model, snippets[0], options);
    snippets.splice(0, 1);
    return await this.mergeAll(merged, snippets, options);
  }
}
