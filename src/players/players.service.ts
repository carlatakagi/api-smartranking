import { v4 as uuidv4 } from 'uuid';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Player } from 'src/interfaces/player';
import { CreatePlayerDto } from 'src/dto/create-player.dto';

@Injectable()
export class PlayersService {
  private players: Player[] = [];

  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  private readonly logger = new Logger(PlayersService.name);

  async createUpdatePlayer(createPlayerDto: CreatePlayerDto): Promise<void> {
    const { email } = createPlayerDto;

    const foundedPlayer = await this.playerModel.findOne({ email }).exec();

    if (foundedPlayer) {
      await this.update(createPlayerDto);
    } else {
      await this.createPlayer(createPlayerDto);
    }
  }

  async getAllPlayers(): Promise<Player[]> {
    return await this.playerModel.find().exec();
  }

  async getPlayerByEmail(email: string): Promise<Player> {
    const foundedPlayer = this.players.find((player) => player.email === email);

    if (!foundedPlayer) {
      throw new NotFoundException(`Player email ${email} not founded.`);
    }
    return foundedPlayer;
  }

  private async createPlayer(
    createPlayerDto: CreatePlayerDto,
  ): Promise<Player> {
    const playerCreated = new this.playerModel(createPlayerDto);

    return await playerCreated.save();
    // const { name, email, phoneNumber } = createPlayerDto;
    // const player: Player = {
    //   _id: uuidv4(),
    //   name,
    //   email,
    //   phoneNumber,
    //   ranking: 'A',
    //   rankingPosition: 1,
    //   urlPlayerImage: 'www.google.com/phot123.png',
    // };
    // this.logger.log(`createPlayer: ${JSON.stringify(player)}`);
    // this.players.push(player);
  }

  private async update(createPlayerDto: CreatePlayerDto): Promise<Player> {
    return await this.playerModel
      .findOneAndUpdate(
        { email: createPlayerDto.email },
        { $set: createPlayerDto },
      )
      .exec();
  }

  async removePlayer(email: string): Promise<void> {
    return await this.playerModel.remove({ email }).exec();
    //   const foundedPlayer = await this.players.find(
    //     (player) => player.email === email,
    //   );

    //   this.players = this.players.filter(
    //     (player) => player.email !== foundedPlayer.email,
    //   );
  }
}
