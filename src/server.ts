import express, { Request, Response } from 'express';
import { Storage } from './storage/storage';

const app = express();
app.use(express.json());

const storageFilePath = 'data.json';
const storage = new Storage(storageFilePath);

app.post('/api/set', async (req: Request, res: Response) => {
  const { key, value } = req.body;
  if (!key || !value) {
    return res.status(400).json({ error: 'La clé et la valeur sont requises' });
  }

  try {
    await storage.set(key, value);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

app.get('/api/get/:key', async (req: Request, res: Response) => {
  const key = req.params.key;
  try {
    const value = await storage.get(key);
    if (value === undefined) {
      return res.status(404).json({ error: 'Données non trouvées' });
    }
    res.json({ [key]: value });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

app.delete('/api/delete/:key', async (req: Request, res: Response) => {
  const key = req.params.key;
  try {
    await storage.remove(key);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Le serveur écoute sur le port ${PORT}`);
});
