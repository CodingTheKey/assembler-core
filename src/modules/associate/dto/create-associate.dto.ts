import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateAssociateDto {
  @IsString({ message: 'Informe o nome completo.' })
  @MinLength(3, { message: 'O nome deve ter pelo menos 3 caracteres.' })
  @Matches(/^[A-Za-zÀ-ÿ\s]+$/, {
    message: 'O nome deve conter apenas letras.',
  })
  name: string;

  @IsString({ message: 'Informe o endereço.' })
  address: string;

  @IsString({ message: 'Informe o e-mail.' })
  @MinLength(10, { message: 'O e-mail deve ter pelo menos 10 caracteres.' })
  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  email: string;

  @IsOptional()
  image?: any;

  @IsString({ message: 'Informe o gênero.' })
  gender: string;

  @IsDate({ message: 'Informe a data de nascimento.' })
  @Matches(/^\d{4}\/\d{2}\/\d{2}$/, {
    message: 'A data deve estar no formato AAAA/MM/DD.',
  })
  birthDate: Date;

  @IsString({ message: 'Informe a nacionalidade.' })
  nationality: string;

  @IsString({ message: 'Informe a naturalidade.' })
  placeOfBirth: string;

  @IsString({ message: 'Informe o número.' })
  @Matches(/^[0-9A-Za-z]+$/, {
    message: 'O número deve conter apenas números e letras (ex: 123A)',
  })
  number: string;

  @IsString({ message: 'Informe o bairro.' })
  neighborhood: string;

  @IsString({ message: 'Informe a cidade.' })
  city: string;

  @IsString({ message: 'Informe o CEP.' })
  @Matches(/^\d{5}-?\d{3}$/, {
    message: 'O CEP deve estar no formato XXXXX-XXX.',
  })
  zipCode: string;

  @IsString({ message: 'Informe o celular.' })
  @Matches(/^(\(\d{2}\)\s?)?\d{5}-?\d{4}$/, {
    message: 'Informe o celular no formato (XX)XXXXX-XXXX.',
  })
  cellPhone: string;

  @IsString({ message: 'Informe o RG.' })
  rg: string;

  @IsString({ message: 'Informe o CPF.' })
  @Matches(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, {
    message: 'Informe o CPF no formato XXX.XXX.XXX-XX.',
  })
  cpf: string;

  @IsBoolean()
  isSpecialNeeds: boolean;

  @IsString({ message: 'Informe o número do título de eleitor.' })
  voterRegistrationNumber: string;

  @IsString({ message: 'Informe a zona eleitoral.' })
  electoralZone: string;

  @IsString({ message: 'Informe a seção eleitoral.' })
  electoralSection: string;

  @IsString({ message: 'Informe o estado civil.' })
  maritalStatus: string;

  @IsString({ message: 'Informe o nome da unidade associada.' })
  associatedUnityName: string;

  @IsString({ message: 'Informe o ID da unidade associada.' })
  unityId: string;
}
