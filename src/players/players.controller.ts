import {
  Controller,
  Body,
  Delete,
  Get,
  Post,
  Param,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { PlayersParamsValidationPipe } from 'src/pipes/players-params-validation.pipe';

import { CreatePlayerDto } from 'src/dto/create-player.dto';
import { Player } from 'src/interfaces/player';

import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  async getAllPlayers(): Promise<Player[]> {
    return this.playersService.getAllPlayers();
  }

  @Get('/:email')
  async getPlayerByEmail(
    @Param('email', PlayersParamsValidationPipe) email: string,
  ): Promise<Player> {
    return this.playersService.getPlayerByEmail(email);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createUpdatePlayer(@Body() createPlayerDto: CreatePlayerDto) {
    return this.playersService.createUpdatePlayer(createPlayerDto);
  }

  @Delete()
  async deletePlayer(
    @Param('email', PlayersParamsValidationPipe) email: string,
  ): Promise<void> {
    this.playersService.removePlayer(email);
  }
}
