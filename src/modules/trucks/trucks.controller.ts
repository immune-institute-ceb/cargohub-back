import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  ParseEnumPipe,
  Query,
} from '@nestjs/common';
import { TrucksService } from './trucks.service';
import { CreateTruckDto } from './dto/create-truck.dto';
import { UpdateTruckDto } from './dto/update-truck.dto';
import { ParseMongoIdPipe } from '@common/pipes/parse-mongo-id.pipe';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiCreatedResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { Auth } from '@modules/auth/decorators';
import { TruckStatus } from './interfaces/truck-status.interface';
import { FinalTruckStatus } from './dto/update-status.dto';

@Controller('trucks')
export class TrucksController {
  constructor(private readonly trucksService: TrucksService) {}

  @Post()
  @ApiBearerAuth()
  @Auth()
  @ApiOperation({ summary: 'Create a new truck' })
  @ApiCreatedResponse({
    description: 'Truck created successfully',
    type: CreateTruckDto,
  })
  create(@Body() createTruckDto: CreateTruckDto) {
    return this.trucksService.create(createTruckDto);
  }

  @Get()
  findAll() {
    return this.trucksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.trucksService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateTruckDto: UpdateTruckDto,
  ) {
    return this.trucksService.update(id, updateTruckDto);
  }

  @Patch('status/:id')
  @ApiOperation({ summary: 'Update truck status' })
  @ApiQuery({
    name: 'status',
    required: true,
    description: 'New status for the request',
    enum: [TruckStatus.maintenance],
  })
  updateStatus(
    @Param('id', ParseMongoIdPipe) id: string,
    @Query(
      'status',
      new ParseEnumPipe([TruckStatus.maintenance], {
        errorHttpStatusCode: 400,
        exceptionFactory: () =>
          new BadRequestException('Status must be maintenance'),
      }),
    )
    status: FinalTruckStatus,
  ) {
    return this.trucksService.updateTruckStatus(id, status);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.trucksService.remove(id);
  }
}
