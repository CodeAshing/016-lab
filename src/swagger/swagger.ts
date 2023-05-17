import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

import { SWAGGER_CONFIG } from './swagger.config';
import { TokenEnum } from 'src/app/auth/enum';

/**
 * Creates an OpenAPI document for an application, via swagger.
 * @param app the nestjs application
 * @returns the OpenAPI document
 */
export function createDocument(app: INestApplication): OpenAPIObject {
  const builder = new DocumentBuilder()
    .setTitle(SWAGGER_CONFIG.title)
    .setDescription(SWAGGER_CONFIG.description).addApiKey({
      type: 'apiKey',
      in: 'cookie',
      name: TokenEnum.ACCESS, // Specify the name of the cookie used for authentication
    }).setVersion(SWAGGER_CONFIG.version);
  for (const tag of SWAGGER_CONFIG.tags) {
    builder.addTag(tag);
  }
  const options = builder.build();

  return SwaggerModule.createDocument(app, options);
}
