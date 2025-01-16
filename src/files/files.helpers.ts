import { FILE_SIZE_LIMIT, FILES_ALLOWED_EXTENSIONS } from 'src/utils/constants';
import { FullName } from './files.interfaces';
import * as JSZip from 'jszip';
import { parseStringPromise } from 'xml2js';

// Helpers
export function validateFile(file: Express.Multer.File) {
  // File exists check
  if (!file?.buffer) {
    return {
      valid: false,
      name: file.filename,
      origin: file.originalname,
      error: 'File not found',
    };
  }
  // Size check
  if (file.size > FILE_SIZE_LIMIT) {
    return {
      valid: false,
      name: file.filename,
      origin: file.originalname,
      error: 'File too big',
    };
  }
  const [folderName, fileName] = Buffer.from(file.originalname, 'binary')
    .toString('utf-8')
    .split('/');
  const extension = fileName.split('.').pop()?.toLowerCase();
  // Extension type check
  if (
    !extension ||
    !Object.keys(FILES_ALLOWED_EXTENSIONS).includes(extension)
  ) {
    return {
      valid: false,
      origin: file.originalname,
      error: 'Extension is not allowed',
    };
  }
  // File signature congruency check
  if (
    !FILES_ALLOWED_EXTENSIONS[extension].hex_prefix.some((hex) =>
      file.buffer.toString('hex').toUpperCase().startsWith(hex),
    )
  ) {
    console.log('@@@', FILES_ALLOWED_EXTENSIONS[extension].hex_prefix);
    return {
      valid: false,
      origin: file.originalname,
      error: `Invalid signature (${file.mimetype}, ${file.buffer.toString('hex').slice(0, 50)})`,
    };
  }
  return {
    valid: true,
    origin: file.originalname,
    error: null,
  };
}

export function validateTimestampAndConvertToDate(timestamp: string | number): {
  valid: boolean;
  error?: string;
  data?: Date;
} {
  // Validate TimeStamp
  if (isNaN(Number(timestamp))) {
    return { valid: false, error: 'Invalid lastModified timestamp' };
  }
  const lastModifiedDate = new Date(Number(timestamp));
  // Validate date
  if (isNaN(lastModifiedDate.getTime())) {
    return { valid: false, error: 'Invalid date derived from timestamp' };
  }
  // Validate date is in the past
  if (lastModifiedDate > new Date()) {
    return { valid: false, error: 'Timestamp cannot be in the future' };
  }
  return { valid: true, data: lastModifiedDate };
}

export function compareNames(fullNameObject: FullName, firstName: string, middleName: string, lastName: string): boolean {
  if (!fullNameObject) return false;
  return fullNameObject.firstName === firstName && fullNameObject.middleName === middleName && fullNameObject.lastName === lastName;
}

export async function parseDocxBuffer(docxBuffer: Buffer): Promise<string[][]> {
  const zip = new JSZip();

  // Access the XML file where the document's content is stored
  const docx = await zip.loadAsync(docxBuffer);
  const documentXml = await docx.file('word/document.xml').async('string');

  // Parse the XML
  const parsedXml = await parseStringPromise(documentXml);

  // Navigate to tables in the document XML
  const tables = [];
  const body = parsedXml['w:document']['w:body'][0];
  const tableElements = body['w:tbl'];

  if (tableElements) {
    tableElements.forEach((table: any) => {
      const rows = table['w:tr']; // Table rows
      const parsedTable = rows.map((row: any) => {
        const cells = row['w:tc']; // Table cells
        return cells.map((cell: any) => {
          // Extract the text content from each cell
          const paragraphs = cell['w:p'];
          return paragraphs
            .map((p: any) => p['w:r']?.map((r: any) => r['w:t']?.join('')).join(''))
            .join(' ');
        });
      });
      tables.push(parsedTable);
    });
  }

  return tables;
}