import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';

@Injectable()
export class SocketService {

    constructor(private socket: Socket) { }

    signup(nick: string, pass: string)
    {
      this.socket.emit("signup", nick, pass);
    }

    login() {
         return this.socket
             .fromEvent("login").pipe(map((data) => data));
    }

    signin(nick: string, pass: string)
    {
      this.socket.emit("signin", nick, pass);
    }



    sendMessage(nick:string, msg: string, cnl: number){
        this.socket.emit("new-message", nick, msg, cnl);
    }
    chooseCnl(cnl:number){
        this.socket.emit("Channel", cnl);
    }
     getMessage() {
         return this.socket
             .fromEvent("resp-message").pipe(map((data) => data));
    }


    getCnl() {
         return this.socket
             .fromEvent("resp-cnl").pipe(map((data) => data));
    }

    getUsr() {
         return this.socket
             .fromEvent("resp-usr").pipe(map((data) => data));
    }
}
