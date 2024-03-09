import fs from 'fs';
import { promisify } from 'util';

const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);
const unlinkAsync = promisify(fs.unlink);

export interface StorageData {
  [key: string]: any;
}

export class Storage {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  async set(key: string, value: any): Promise<void> {
    let data: StorageData = {};
    try {
      const fileContent = await readFileAsync(this.filePath, 'utf-8');
      data = JSON.parse(fileContent);
    } catch (error: any) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }

    data[key] = value;
    await writeFileAsync(this.filePath, JSON.stringify(data));
  }

  async get(key: string): Promise<any | undefined> {
    try {
      const fileContent = await readFileAsync(this.filePath, 'utf-8');
      const data: StorageData = JSON.parse(fileContent);
      return data[key];
    } catch (error:any) {
      if (error.code === 'ENOENT') {
        return undefined;
      }
      throw error;
    }
  }

  async remove(key: string): Promise<void> {
    let data: StorageData = {};
    try {
      const fileContent = await readFileAsync(this.filePath, 'utf-8');
      data = JSON.parse(fileContent);
    } catch (error:any) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }

    delete data[key];
    await writeFileAsync(this.filePath, JSON.stringify(data));
  }
}
