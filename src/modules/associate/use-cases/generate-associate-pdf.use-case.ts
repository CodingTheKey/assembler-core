import { Inject, Injectable } from '@nestjs/common';
import fontkit from '@pdf-lib/fontkit'; // Importar fontkit explicitamente
import dayjs from 'dayjs';
import { PDFDocument, PDFPage, rgb, StandardFonts } from 'pdf-lib';
import type { StorageServiceInterface } from '../../storage/interfaces/storage.service.interface';
import { Associate } from '../entities/associate.entity';

@Injectable()
export class GenerateAssociatePdfUseCase {
  constructor(
    @Inject('StorageServiceInterface')
    private readonly storageService: StorageServiceInterface,
  ) {}

  // Função para traduzir gênero de inglês para português
  private translateGender(gender: string): string {
    const genderMap: { [key: string]: string } = {
      male: 'Masculino',
      female: 'Feminino',
      other: 'Outro',
      not_informed: 'Não informado',
    };
    return genderMap[gender?.toLowerCase()] || gender || '';
  }

  // Função para traduzir estado civil de inglês para português
  private translateMaritalStatus(maritalStatus: string): string {
    const maritalStatusMap: { [key: string]: string } = {
      single: 'Solteiro(a)',
      married: 'Casado(a)',
      divorced: 'Divorciado(a)',
      widowed: 'Viúvo(a)',
      separated: 'Separado(a)',
      stable_union: 'União Estável',
      not_informed: 'Não informado',
    };
    return (
      maritalStatusMap[maritalStatus?.toLowerCase()] || maritalStatus || ''
    );
  }

  // Função para desenhar texto justificado
  private drawJustifiedText(
    page: PDFPage,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    fontSize: number,
    font: any,
    color: any,
    lineHeight: number,
  ): number {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    // Quebrar texto em linhas
    for (const word of words) {
      const testLine = currentLine === '' ? word : `${currentLine} ${word}`;
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);

      if (testWidth > maxWidth && currentLine !== '') {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    // Adicionar a última linha
    if (currentLine !== '') {
      lines.push(currentLine);
    }

    let currentY = y;

    // Desenhar cada linha com justificação (exceto a última)
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const isLastLine = i === lines.length - 1;

      if (isLastLine) {
        // Última linha: não justificar, apenas alinhar à esquerda
        page.drawText(line, {
          x: x,
          y: currentY,
          font: font,
          size: fontSize,
          color: color,
        });
      } else {
        // Justificar a linha
        const wordsInLine = line.split(' ');

        if (wordsInLine.length === 1) {
          // Se há apenas uma palavra, não justificar
          page.drawText(line, {
            x: x,
            y: currentY,
            font: font,
            size: fontSize,
            color: color,
          });
        } else {
          // Calcular espaços entre palavras para justificação
          const totalWordsWidth = wordsInLine.reduce((sum, word) => {
            return sum + font.widthOfTextAtSize(word, fontSize);
          }, 0);

          const totalSpaceWidth = maxWidth - totalWordsWidth;
          const spaceBetweenWords = totalSpaceWidth / (wordsInLine.length - 1);

          let currentX = x;

          // Desenhar cada palavra com o espaçamento calculado
          for (let j = 0; j < wordsInLine.length; j++) {
            const word = wordsInLine[j];

            page.drawText(word, {
              x: currentX,
              y: currentY,
              font: font,
              size: fontSize,
              color: color,
            });

            currentX += font.widthOfTextAtSize(word, fontSize);

            // Adicionar espaço entre palavras (exceto após a última palavra)
            if (j < wordsInLine.length - 1) {
              currentX += spaceBetweenWords;
            }
          }
        }
      }

      currentY -= lineHeight;
    }

    return lines.length;
  }

  private async loadImageFromR2(
    key: string,
    pdfDoc: PDFDocument,
  ): Promise<{ image: any; width: number; height: number } | null> {
    try {
      // Para o logo, usar o arquivo do repositório local primeiro
      if (key === 'logo.jpeg') {
        try {
          // Tentar carregar o logo do sistema de arquivos local
          const fs = await import('fs');
          const path = await import('path');

          const logoPath = path.join(process.cwd(), 'assets', 'logo.jpeg');
          if (fs.existsSync(logoPath)) {
            const logoBuffer = fs.readFileSync(logoPath);
            const imageBytes = new Uint8Array(logoBuffer);

            // Verificar magic bytes para JPEG
            if (
              imageBytes[0] === 0xff &&
              imageBytes[1] === 0xd8 &&
              imageBytes[2] === 0xff
            ) {
              const image = await pdfDoc.embedJpg(imageBytes);
              const { width, height } = image.size();
              return { image, width, height };
            }
          }
        } catch (error) {
          console.warn(
            'Logo não encontrado no sistema de arquivos local, continuando sem logo',
          );
        }
        return null;
      }

      // Para imagens do associado, tentar buscar via URL direta (se for uma URL)
      if (key.startsWith('http')) {
        return await this.loadImage(key, pdfDoc);
      }

      // Para outras imagens do R2, simular a busca
      // TODO: Implementar busca real do R2 quando necessário
      console.warn(`R2 image loading not fully implemented for key: ${key}`);
      return null;
    } catch (error) {
      console.error(`Error loading image from R2: ${key}`, error);
      return null;
    }
  }

  private async loadImage(
    url: string,
    pdfDoc: PDFDocument,
  ): Promise<{ image: any; width: number; height: number } | null> {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        console.warn(
          `Failed to fetch image from ${url}: ${response.status} - ${response.statusText}`,
        );
        return null;
      }

      const arrayBuffer = await response.arrayBuffer();
      const imageBytes = new Uint8Array(arrayBuffer);

      // Verificar se é uma imagem válida através dos magic bytes
      if (imageBytes.length < 4) {
        console.warn(
          `Image too small from ${url} - ${imageBytes.length} bytes`,
        );
        return null;
      }

      // Verificar magic bytes para JPEG
      if (
        imageBytes[0] === 0xff &&
        imageBytes[1] === 0xd8 &&
        imageBytes[2] === 0xff
      ) {
        const image = await pdfDoc.embedJpg(imageBytes);
        const { width, height } = image.size();
        return { image, width, height };
      }

      // Verificar magic bytes para PNG
      if (
        imageBytes[0] === 0x89 &&
        imageBytes[1] === 0x50 &&
        imageBytes[2] === 0x4e &&
        imageBytes[3] === 0x47
      ) {
        const image = await pdfDoc.embedPng(imageBytes);
        const { width, height } = image.size();
        return { image, width, height };
      }

      console.warn(`Unsupported image format from ${url}`);
      return null;
    } catch (error) {
      console.error(`Error loading image from ${url}:`, error);
      return null;
    }
  }

  async execute(associate: Associate): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit); // Registrar fontkit para uso de fontes
    const page = pdfDoc.addPage([595, 842]); // A4
    const { width, height } = page.getSize();

    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const textColor = rgb(0, 0, 0); // Cor preta para o texto

    let yOffset = height - 50; // Posição Y inicial (margem superior)

    // Helper function to draw text
    const drawText = (
      text: string,
      x: number,
      y: number,
      size: number,
      fontType: any = helvetica,
    ) => {
      page.drawText(text, {
        x,
        y,
        font: fontType,
        size,
        color: textColor,
      });
    };

    // Helper function to draw a line
    const drawLine = (x1: number, y1: number, x2: number, y2: number) => {
      page.drawLine({
        start: { x: x1, y: y1 },
        end: { x: x2, y: y2 },
        thickness: 0.5,
        color: textColor,
      });
    };

    // Helper function to draw a label and an underlined value, with an optional comma
    const drawLabelAndUnderlinedValue = (
      page: PDFPage,
      label: string,
      value: string,
      startX: number,
      y: number,
      fontSize: number,
      font: any,
      boldFont: any,
      textColor: any,
      underlineEndX: number,
      addComma: boolean = false,
    ) => {
      const labelWidth = boldFont.widthOfTextAtSize(label, fontSize);
      const valueX = startX + labelWidth + 2; // Pequeno espaçamento entre o rótulo e o valor

      // Desenhar rótulo
      page.drawText(label, {
        x: startX,
        y: y,
        font: boldFont,
        size: fontSize,
        color: textColor,
      });

      // Desenhar valor
      page.drawText(value, {
        x: valueX,
        y: y,
        font: font,
        size: fontSize,
        color: textColor,
      });

      // Desenhar sublinhado
      page.drawLine({
        start: { x: valueX, y: y - 2 }, // Ligeiramente abaixo do texto
        end: { x: underlineEndX, y: y - 2 },
        thickness: 0.5,
        color: textColor,
      });

      // Desenhar vírgula se solicitado
      if (addComma) {
        page.drawText(',', {
          x: underlineEndX, // Posicionar vírgula no final do sublinhado
          y: y,
          font: boldFont, // Usar fonte negrito para a vírgula como separador
          size: fontSize,
          color: textColor,
        });
      }
    };

    // --- Carregar e desenhar o logo ---
    const imageUrl = 'logo.jpeg';
    const logoData = await this.loadImageFromR2(imageUrl, pdfDoc);

    const logoWidth = 100; // Largura desejada do logo
    const logoHeight = 50; // Altura desejada do logo
    const leftMargin = 50;
    const rightMargin = 50;
    const logoX = leftMargin; // Encostado ao canto superior esquerdo (respeitando a margem)
    const logoY = height - 50 - logoHeight; // Margem superior - altura do logo

    if (logoData) {
      page.drawImage(logoData.image, {
        x: logoX,
        y: logoY + 10,
        width: logoWidth,
        height: logoHeight,
      });
    }

    if (associate.urlImage && associate.urlImage?.length > 0) {
      // Usar URL pattern para carregar a imagem do associado
      const associateImageUrl = `${associate.urlImage}`;
      const associateImageData = await this.loadImageFromR2(
        associateImageUrl,
        pdfDoc,
      );

      if (associateImageData) {
        // Calcular dimensões proporcionais para uma foto
        const photoSize = 80; // Tamanho desejado da foto
        const photoX = width - rightMargin - photoSize - 20; // Posição no canto direito
        const photoY = logoY + (logoHeight - photoSize) / 2; // Centralizar verticalmente com o logo

        // Calcular dimensões proporcionais mantendo aspect ratio
        const { width: originalWidth, height: originalHeight } =
          associateImageData;
        const aspectRatio = originalWidth / originalHeight;

        let imageWidth = photoSize;
        let imageHeight = photoSize;

        if (aspectRatio > 1) {
          // Imagem mais larga que alta - cortar laterais
          imageHeight = photoSize;
          imageWidth = photoSize;
        } else {
          // Imagem mais alta que larga - cortar topo/base
          imageWidth = photoSize;
          imageHeight = photoSize;
        }

        // Desenhar fundo circular branco
        const centerX = photoX + photoSize / 2;
        const centerY = photoY + photoSize / 2;
        const radius = 60;

        // Desenhar a imagem (será cortada pelo círculo visualmente)
        page.drawImage(associateImageData.image, {
          x: photoX,
          y: photoY + 10,
          width: imageWidth,
          height: imageHeight,
        });

        // // Redesenhar a borda circular por cima
        page.drawCircle({
          x: centerX,
          y: centerY + 10,
          size: radius,
          borderColor: rgb(1, 1, 1),
          borderWidth: 40,
        });
      }
    }

    // Ajustar yOffset para que o texto do cabeçalho comece abaixo do logo
    yOffset = logoY - 20; // 20 pontos abaixo do logo

    // --- Informações do Cabeçalho (centralizadas) ---
    const header1 = 'ASSOCIAÇÃO DE GESTÃO EM HABITAÇÃO DE INTERESSE SOCIAL';
    const header1Width = helveticaBold.widthOfTextAtSize(header1, 12);
    drawText(header1, (width - header1Width) / 2, yOffset, 12, helveticaBold);
    yOffset -= 15;

    const header2 = 'CNPJ: 02.165.543/0001-94';
    const header2Width = helvetica.widthOfTextAtSize(header2, 10);
    drawText(header2, (width - header2Width) / 2, yOffset, 10);
    yOffset -= 20;

    const header7 =
      'Estr. Itapecerica, 3540, Sala 11, Vila Prel - Itapecerica da Serra/SP - CEP: 05835-004';
    const header7Width = helvetica.widthOfTextAtSize(header7, 9);
    drawText(header7, (width - header7Width) / 2, yOffset, 9);
    yOffset -= 12;

    const header6 = 'Tim: (11) 9-5957-4450 - Vivo: (11) 9-7539-6020';
    const header6Width = helvetica.widthOfTextAtSize(header6, 9);
    drawText(header6, (width - header6Width) / 2, yOffset, 9);
    yOffset -= 12;

    const header8 =
      'Site: www.fimaprom.org.br -|-E-mail: Fimaprom.fimapi@gmail.com -|- instagram: @fimaprom';
    const header8Width = helvetica.widthOfTextAtSize(header8, 9);
    drawText(header8, (width - header8Width) / 2, yOffset, 9);
    yOffset -= 25;

    const header9 = 'FICHA DE INSCRIÇÃO';
    const header9Width = helveticaBold.widthOfTextAtSize(header9, 16);
    drawText(header9, (width - header9Width) / 2, yOffset, 16, helveticaBold);
    yOffset -= 30;

    // --- Campos do Formulário baseados na estrutura Associate ---
    const usableWidth = width - leftMargin - rightMargin;
    const fieldFontSize = 10;
    const fieldLineHeight = 15; // Espaçamento original entre as linhas
    const fieldGap = 15; // Espaçamento entre o final de um sublinhado e o início do próximo rótulo

    // Formatar data de nascimento
    const formattedBirthDate = associate.birthDate
      ? dayjs(associate.birthDate).format('DD/MM/YYYY')
      : '';

    // Informações Pessoais
    yOffset -= 20;
    drawText('Informações Pessoais', leftMargin, yOffset, 12, helveticaBold);
    console.log('🚀 ~ associate.createdAt:', associate.deletedAt);
    const inscriptionDate = (
      associate.deletedAt || new Date()
    ).toLocaleDateString('pt-BR');
    const inscriptionDateWidth = helveticaBold.widthOfTextAtSize(
      `Data de inscrição: ${inscriptionDate}`,
      12,
    );
    drawText(
      `Data de inscrição: ${inscriptionDate}`,
      leftMargin + usableWidth - inscriptionDateWidth,
      yOffset,
      12,
      helveticaBold,
    );
    yOffset -= fieldLineHeight;

    // Linha 1: Nome (ocupa toda a linha devido ao tamanho variável)
    let currentX = leftMargin;
    let label = 'Nome:';
    let value = associate.name || '';
    drawLabelAndUnderlinedValue(
      page,
      label,
      value,
      currentX,
      yOffset,
      fieldFontSize,
      helvetica,
      helveticaBold,
      textColor,
      width - rightMargin,
      true,
    );
    yOffset -= fieldLineHeight;

    // Linha 2: ID, Gênero, Data de Nascimento
    currentX = leftMargin;
    // ID (tamanho fixo, menor espaço)
    label = 'ID:';
    value = associate.id || '';
    const idLabelWidth = helveticaBold.widthOfTextAtSize(label, fieldFontSize);
    const idValueWidth = helvetica.widthOfTextAtSize(value, fieldFontSize);
    const idUnderlineEnd = currentX + idLabelWidth + idValueWidth + 50; // Espaço fixo menor para ID

    drawLabelAndUnderlinedValue(
      page,
      label,
      value,
      currentX,
      yOffset,
      fieldFontSize,
      helvetica,
      helveticaBold,
      textColor,
      idUnderlineEnd,
      true,
    );

    const reducedFieldGap = 10; // Gap reduzido entre campos
    currentX = idUnderlineEnd + reducedFieldGap;

    // Gênero
    const genderLabel = 'GÊNERO:';
    const genderValue = this.translateGender(associate.gender || '');
    const genderLabelWidth = helveticaBold.widthOfTextAtSize(
      genderLabel,
      fieldFontSize,
    );
    const genderValueWidth = helvetica.widthOfTextAtSize(
      genderValue,
      fieldFontSize,
    );
    const genderUnderlineEnd =
      currentX + genderLabelWidth + genderValueWidth + 20;

    drawLabelAndUnderlinedValue(
      page,
      genderLabel,
      genderValue,
      currentX,
      yOffset,
      fieldFontSize,
      helvetica,
      helveticaBold,
      textColor,
      genderUnderlineEnd,
      true,
    );

    currentX = genderUnderlineEnd + reducedFieldGap;
    // Data de Nascimento (último na linha)
    label = 'DATA NASC.:';
    value = formattedBirthDate;
    drawLabelAndUnderlinedValue(
      page,
      label,
      value,
      currentX,
      yOffset,
      fieldFontSize,
      helvetica,
      helveticaBold,
      textColor,
      width - rightMargin,
      true,
    );
    yOffset -= fieldLineHeight;

    // Linha 3: Nacionalidade, Naturalidade
    currentX = leftMargin;
    // Nacionalidade
    label = 'NACIONALIDADE:';
    value = associate.nationality || '';
    const nationalityLabelWidth = helveticaBold.widthOfTextAtSize(
      label,
      fieldFontSize,
    );
    const nationalityValueWidth = helvetica.widthOfTextAtSize(
      value,
      fieldFontSize,
    );
    const nationalityUnderlineEnd =
      currentX + nationalityLabelWidth + nationalityValueWidth + 80;
    drawLabelAndUnderlinedValue(
      page,
      label,
      value,
      currentX,
      yOffset,
      fieldFontSize,
      helvetica,
      helveticaBold,
      textColor,
      nationalityUnderlineEnd,
      true,
    );

    currentX = nationalityUnderlineEnd + fieldGap;
    // Naturalidade (último na linha)
    label = 'NATURALIDADE:';
    value = associate.placeOfBirth || '';
    drawLabelAndUnderlinedValue(
      page,
      label,
      value,
      currentX,
      yOffset,
      fieldFontSize,
      helvetica,
      helveticaBold,
      textColor,
      width - rightMargin,
      true,
    );
    yOffset -= fieldLineHeight;

    // Linha 4: E-mail
    drawLabelAndUnderlinedValue(
      page,
      'E-MAIL:',
      associate.email || '',
      leftMargin,
      yOffset,
      fieldFontSize,
      helvetica,
      helveticaBold,
      textColor,
      width - rightMargin,
      true,
    ); // Largura total da linha
    yOffset -= fieldLineHeight * 2;

    // Estado Civil
    drawLabelAndUnderlinedValue(
      page,
      'ESTADO CIVIL:',
      this.translateMaritalStatus(associate.maritalStatus || ''),
      leftMargin,
      yOffset,
      fieldFontSize,
      helvetica,
      helveticaBold,
      textColor,
      width - rightMargin,
      true,
    );
    yOffset -= fieldLineHeight * 2;

    // Adicionar linha após o bloco de Informações Pessoais
    drawLine(leftMargin, yOffset, width - rightMargin, yOffset);
    yOffset -= fieldLineHeight; // Espaço após a linha

    // Informações de Endereço
    drawText('Endereço', leftMargin, yOffset, 12, helveticaBold);
    yOffset -= fieldLineHeight;

    // Linha 5: Endereço, Número
    currentX = leftMargin;
    // Endereço
    label = 'ENDEREÇO:';
    value = associate.address || '';
    const addressLabelWidth = helveticaBold.widthOfTextAtSize(
      label,
      fieldFontSize,
    );
    const addressValueWidth = helvetica.widthOfTextAtSize(value, fieldFontSize);
    const addressUnderlineEnd =
      currentX + addressLabelWidth + addressValueWidth + 200;
    drawLabelAndUnderlinedValue(
      page,
      label,
      value,
      currentX,
      yOffset,
      fieldFontSize,
      helvetica,
      helveticaBold,
      textColor,
      addressUnderlineEnd,
      true,
    );

    currentX = addressUnderlineEnd + fieldGap;
    // Número (último na linha)
    label = 'Nº:';
    value = associate.number || '';
    drawLabelAndUnderlinedValue(
      page,
      label,
      value,
      currentX,
      yOffset,
      fieldFontSize,
      helvetica,
      helveticaBold,
      textColor,
      width - rightMargin,
      true,
    );
    yOffset -= fieldLineHeight;

    // Linha 6: Bairro, Cidade, CEP
    currentX = leftMargin;
    // Bairro
    label = 'BAIRRO:';
    value = associate.neighborhood || '';
    const neighborhoodLabelWidth = helveticaBold.widthOfTextAtSize(
      label,
      fieldFontSize,
    );
    const neighborhoodValueWidth = helvetica.widthOfTextAtSize(
      value,
      fieldFontSize,
    );
    const neighborhoodUnderlineEnd =
      currentX + neighborhoodLabelWidth + neighborhoodValueWidth + 50;
    drawLabelAndUnderlinedValue(
      page,
      label,
      value,
      currentX,
      yOffset,
      fieldFontSize,
      helvetica,
      helveticaBold,
      textColor,
      neighborhoodUnderlineEnd,
      true,
    );

    currentX = neighborhoodUnderlineEnd + fieldGap;
    // Cidade
    label = 'CIDADE:';
    value = associate.city || '';
    const cityLabelWidth = helveticaBold.widthOfTextAtSize(
      label,
      fieldFontSize,
    );
    const cityValueWidth = helvetica.widthOfTextAtSize(value, fieldFontSize);
    const cityUnderlineEnd = currentX + cityLabelWidth + cityValueWidth + 50;
    drawLabelAndUnderlinedValue(
      page,
      label,
      value,
      currentX,
      yOffset,
      fieldFontSize,
      helvetica,
      helveticaBold,
      textColor,
      cityUnderlineEnd,
      true,
    );

    currentX = cityUnderlineEnd + fieldGap;
    // CEP (último na linha)
    label = 'CEP:';
    value = associate.zipCode || '';
    drawLabelAndUnderlinedValue(
      page,
      label,
      value,
      currentX,
      yOffset,
      fieldFontSize,
      helvetica,
      helveticaBold,
      textColor,
      width - rightMargin,
      true,
    );
    yOffset -= fieldLineHeight * 2;

    // Adicionar linha após o bloco de Endereço
    drawLine(leftMargin, yOffset, width - rightMargin, yOffset);
    yOffset -= fieldLineHeight; // Espaço após a linha

    // Documentos e Contato
    drawText('Documentos e Contato', leftMargin, yOffset, 12, helveticaBold);
    yOffset -= fieldLineHeight;

    // Linha 7: RG, CPF
    currentX = leftMargin;
    // RG
    label = 'RG:';
    value = associate.rg || '';
    const rgLabelWidth = helveticaBold.widthOfTextAtSize(label, fieldFontSize);
    const rgValueWidth = helvetica.widthOfTextAtSize(value, fieldFontSize);
    const rgUnderlineEnd = currentX + rgLabelWidth + rgValueWidth + 100; // Ajustado para a remoção de Documento Geral
    drawLabelAndUnderlinedValue(
      page,
      label,
      value,
      currentX,
      yOffset,
      fieldFontSize,
      helvetica,
      helveticaBold,
      textColor,
      rgUnderlineEnd,
      true,
    );

    currentX = rgUnderlineEnd + fieldGap;
    // CPF (último na linha)
    label = 'CPF:';
    value = associate.cpf || '';
    drawLabelAndUnderlinedValue(
      page,
      label,
      value,
      currentX,
      yOffset,
      fieldFontSize,
      helvetica,
      helveticaBold,
      textColor,
      width - rightMargin,
      true,
    );
    yOffset -= fieldLineHeight;

    // Linha 8: Celular, Título de Eleitor
    currentX = leftMargin;
    // Celular
    label = 'CELULAR:';
    value = associate.cellPhone || '';
    const cellPhoneLabelWidth = helveticaBold.widthOfTextAtSize(
      label,
      fieldFontSize,
    );
    const cellPhoneValueWidth = helvetica.widthOfTextAtSize(
      value,
      fieldFontSize,
    );
    const cellPhoneUnderlineEnd =
      currentX + cellPhoneLabelWidth + cellPhoneValueWidth + 80;
    drawLabelAndUnderlinedValue(
      page,
      label,
      value,
      currentX,
      yOffset,
      fieldFontSize,
      helvetica,
      helveticaBold,
      textColor,
      cellPhoneUnderlineEnd,
      true,
    );

    currentX = cellPhoneUnderlineEnd + fieldGap;
    // Título de Eleitor (último na linha)
    label = 'TÍTULO DE ELEITOR:';
    value = associate.voterRegistrationNumber || '';
    drawLabelAndUnderlinedValue(
      page,
      label,
      value,
      currentX,
      yOffset,
      fieldFontSize,
      helvetica,
      helveticaBold,
      textColor,
      width - rightMargin,
      true,
    );
    yOffset -= fieldLineHeight;

    // Linha 9: Zona Eleitoral, Seção Eleitoral, Necessidades Especiais
    currentX = leftMargin;
    // Zona Eleitoral
    label = 'ZONA ELEITORAL:';
    value = associate.electoralZone || '';
    const zoneLabelWidth = helveticaBold.widthOfTextAtSize(
      label,
      fieldFontSize,
    );
    const zoneValueWidth = helvetica.widthOfTextAtSize(value, fieldFontSize);
    const zoneUnderlineEnd = currentX + zoneLabelWidth + zoneValueWidth + 30;
    drawLabelAndUnderlinedValue(
      page,
      label,
      value,
      currentX,
      yOffset,
      fieldFontSize,
      helvetica,
      helveticaBold,
      textColor,
      zoneUnderlineEnd,
      true,
    );

    currentX = zoneUnderlineEnd + fieldGap;
    // Seção Eleitoral
    label = 'SEÇÃO ELEITORAL:';
    value = associate.electoralSection || '';
    const sectionLabelWidth = helveticaBold.widthOfTextAtSize(
      label,
      fieldFontSize,
    );
    const sectionValueWidth = helvetica.widthOfTextAtSize(value, fieldFontSize);
    const sectionUnderlineEnd =
      currentX + sectionLabelWidth + sectionValueWidth + 30;
    drawLabelAndUnderlinedValue(
      page,
      label,
      value,
      currentX,
      yOffset,
      fieldFontSize,
      helvetica,
      helveticaBold,
      textColor,
      sectionUnderlineEnd,
      true,
    );

    currentX = sectionUnderlineEnd + fieldGap;
    // Necessidades Especiais (último na linha)
    label = 'NECESSIDADES ESPECIAIS:';
    value = associate.isSpecialNeeds ? 'Sim' : 'Não';
    drawLabelAndUnderlinedValue(
      page,
      label,
      value,
      50,
      yOffset - 15,
      fieldFontSize,
      helvetica,
      helveticaBold,
      textColor,
      width - rightMargin,
      true,
    );
    yOffset -= fieldLineHeight * 2 + 15;

    // Adicionar linha após o bloco de Documentos e Contato
    drawLine(leftMargin, yOffset, width - rightMargin, yOffset);
    yOffset -= fieldLineHeight; // Espaço após a linha

    // Texto da Declaração com justificação
    const termo = `DECLARO que todas as informações fornecidas nesta ficha de inscrição são de minha total responsabilidade e, caso seja necessário, complementarei as informações de acordo com o que for requerido pela associação. Estou ciente de que a inscrição realizada é pessoal e intransferível e não me garante a aquisição de qualquer tipo de moradia, mas me assegura o direito e o dever de, em conjunto com os demais associados que, por si, formam esta associação, realizar os esforços necessários para cumprir os requisitos individuais e coletivos estabelecidos pelas secretarias habitacionais e suas autarquias ou empresas vinculadas aos poderes públicos Federal, Estadual e Municipal, quando houver credenciamento de entidades civis visando à produção habitacional, por meio de seleções ou editais públicos, objetivando, por fim, a conquista do primeiro imóvel, exclusivamente de interesse social, por meio de subsídio habitacional. Reconheço e aceito as normas previstas no Estatuto Social e no Regimento Interno, incluindo a obrigatoriedade de manter as mensalidades em dia, garantindo assim os recursos necessários para custear as despesas operacionais e preservar a estrutura organizacional da associação, que é a ferramenta de utilização dos associados para alcançarem seu objetivo comum, conforme disposto no Artigo 8º do Estatuto Social. DECLARO, ainda, não ser proprietário(a) de imóvel residencial nem possuir financiamento de imóvel em qualquer parte do território nacional, bem como nunca ter sido atendido(a) por programas habitacionais da Secretaria da Habitação, CDHU, COHAB, MCMV ou outros agentes promotores de moradias populares. Declaro, ainda, estar ciente de que, em caso de exclusão ou desistência, não terei direito à devolução de qualquer valor pago, visto que esses pagamentos representam, exclusivamente, o rateio mensal destinado a cobrir as despesas necessárias ao funcionamento da associação, conforme o Artigo 9º, parágrafo único, do Estatuto Social.`;

    const textWidth = width - 100; // 50px de margem em cada lado
    const fontSizeDeclaration = 8;
    const lineHeightDeclaration = 10;

    // Usar a função de texto justificado
    const numLines = this.drawJustifiedText(
      page,
      termo,
      50, // x
      yOffset, // y
      textWidth, // maxWidth
      fontSizeDeclaration, // fontSize
      helvetica, // font
      textColor, // color
      lineHeightDeclaration, // lineHeight
    );

    // Ajustar yOffset com base no número de linhas desenhadas
    yOffset -= numLines * lineHeightDeclaration + 30; // Espaço aumentado após a declaração

    // Rodapé - Assinatura e Ficha de Inscrição
    const signatureLineY = yOffset; // A linha será desenhada neste Y
    const textBelowLineOffset = 15; // O texto ficará 15 pontos abaixo da linha

    const signature = 'ASSINATURA DO ASSOCIADO';
    const signatureWidth = helveticaBold.widthOfTextAtSize(header9, 16);
    // drawText(header9, (width - header9Width) / 2, yOffset, 16, helveticaBold);
    // yOffset -= 30;

    // Assinatura
    drawLine(150, signatureLineY - 70, 400, signatureLineY - 70); // Linha para assinatura
    drawText(
      signature,
      (width - signatureWidth) / 2,
      signatureLineY - textBelowLineOffset - 70,
      10,
    );

    // Finalizar PDF
    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  }
}
