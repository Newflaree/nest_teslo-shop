import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import {
  Server,
  Socket
} from 'socket.io';
import { MessagesWsService } from './messages-ws.service';
import { NewMessageDto } from './dto/new-message.dto';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService
  ) {}

  handleConnection( client: Socket ) {
    this.messagesWsService.registerClient( client );
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients() );
  }

  handleDisconnect( client: Socket ) {
    this.messagesWsService.removeClient( client.id );
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients() );
  }

  @SubscribeMessage('message-from-client')
  handleMessageFromClient( client: Socket, payload: NewMessageDto ) {
    //! Emite únicamente al cliente
    /*
    client.emit('message-from-server', {
      fullName: 'Soy Yo',
      message: payload.message || 'no-message'
    })
     * */

    //! Emite a todos MENOA al cliente inicial
    /*
    client.broadcast.emit('message-from-server', {
      fullName: 'Soy Yo',
      message: payload.message || 'no-message'
    })
     * */

    this.wss.emit('message-from-server', {
      fullName: 'Soy Yo',
      message: payload.message || 'no-message'
    })
  }
}
