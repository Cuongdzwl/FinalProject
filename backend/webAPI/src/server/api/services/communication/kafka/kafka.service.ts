import { Kafka, logLevel, Consumer, Producer, Admin } from 'kafkajs';
import l from '../../../../common/logger';

// const kafka = new Kafka({
//   clientId: 'be-authentication',
//   brokers: ['kafka1:9092', 'kafka2:9092'],
// });

// const producer = kafka.producer();

export class KafkaService {
  private kafka: Kafka;
  private admin: Admin;
  private producer: Producer;
  private consumers: Map<string, Consumer>;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'my-app',
      brokers: ['localhost:9092'],
      logLevel: logLevel.INFO,
    });

    this.admin = this.kafka.admin();
    this.producer = this.kafka.producer();
    this.consumers = new Map<string, Consumer>();
  }

  async createTopic(topic: string): Promise<void> {
    await this.admin.connect();
    await this.admin.createTopics({
      topics: [{ topic }],
    });
    await this.admin.disconnect();
  }

  async publishMessage(topic: string, message: {}): Promise<void> {
    await this.producer.connect();

    var data: any = { ...message };

    // Add

    
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(data) }],
    });
    await this.producer.disconnect();
  }

  async subscribeToTopic(
    topic: string,
    callback: (message: string) => void
  ): Promise<void> {
    let consumer = this.consumers.get(topic);
    if (!consumer) {
      consumer = this.kafka.consumer({ groupId: `group-${topic}` });
      await consumer.connect();
      await consumer.subscribe({ topic, fromBeginning: true });
      this.consumers.set(topic, consumer);
    }

    await consumer.run({
      eachMessage: async ({ message }) => {
        callback(message.value?.toString() || '');
      },
    });
  }

  async stopConsuming(topic: string): Promise<void> {
    const consumer = this.consumers.get(topic);
    if (consumer) {
      await consumer.disconnect();
      this.consumers.delete(topic);
    }
  }
}
export default new KafkaService();
