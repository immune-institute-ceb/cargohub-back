// Objective: Define the response data transfer object for the generate 2fa code endpoint

// * NestJS modules
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data transfer object to generate 2fa code response
 * @export
 * @class Generate2faCodeResponseDto
 * @example
 * {
 *  "message": "2FA code generated",
 *  "secret" : "JBSWY3DPE",
 *  "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
 * }
 */
export class Generate2faCodeResponseDto {
  @ApiProperty({
    description: 'Message',
    type: String,
    example: '2FA code generated',
  })
  message: string;
  @ApiProperty({
    description: 'Secret',
    type: String,
    example: 'JBSWY3DPEHPK3PXP',
  })
  secret: string;
  @ApiProperty({
    description: 'QR Code',
    type: String,
    example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
  })
  qrCode: string;
}
