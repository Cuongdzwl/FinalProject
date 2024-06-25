import { Request, Response } from 'express';
import kafkaService from '../../services/communication/kafka/kafka.service';

class KafkaController {
  async createTopic(req: Request, res: Response): Promise<void> {
    const { topic } = req.body;
    try {
      await kafkaService.createTopic(topic);
      res.status(201).send({ message: `Topic ${topic} created` });
    } catch (error) {
      res.status(500).send({ error: 'Failed to create topic' });
    }
  }

  async publishMessage(req: Request, res: Response): Promise<void> {
    const { topic, message } = req.body;
    try {
      await kafkaService.publishMessage(topic, message);
      res.status(200).send({ message: 'Message published' });
    } catch (error) {
      res.status(500).send({ error: 'Failed to publish message' });
    }
  }

  async subscribeToTopic(req: Request, res: Response): Promise<void> {
    const  topic  = req.query.topic?.toString() || '';
    try {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      await kafkaService.subscribeToTopic(topic, (message: string) => {
        res.write(`data: ${message}\n\n`);
      });
    } catch (error) {
      res.status(500).send({ error: 'Failed to subscribe to topic' });
    }
  }

  async stopConsuming(req: Request, res: Response): Promise<void> {
    const  topic  = req.query.topic?.toString() || '';
    try {
      await kafkaService.stopConsuming(topic);
      res.status(200).send({ message: `Stopped consuming from topic ${topic}` });
    } catch (error) {
      res.status(500).send({ error: 'Failed to stop consuming from topic' });
    }
  }
}

export default new KafkaController();