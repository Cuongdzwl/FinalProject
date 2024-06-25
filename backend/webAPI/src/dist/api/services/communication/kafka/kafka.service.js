"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaService = void 0;
const kafkajs_1 = require("kafkajs");
const logger_1 = __importDefault(require("../../../../common/logger"));
const kafka = new kafkajs_1.Kafka({
    clientId: 'be-authentication',
    brokers: ['kafka1:9092', 'kafka2:9092'],
});
const producer = kafka.producer();
class KafkaService {
    async send(topic, message) {
        try {
            await producer.connect();
            await producer.send({
                topic: topic,
                messages: message,
            });
        }
        catch (err) {
            logger_1.default.error(err);
            return false;
        }
        finally {
            await producer.disconnect();
            return true;
        }
    }
}
exports.KafkaService = KafkaService;
//# sourceMappingURL=kafka.service.js.map