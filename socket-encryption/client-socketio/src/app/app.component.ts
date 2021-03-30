import { Component, ViewChild, ElementRef } from '@angular/core';
import { SocketService } from './socket.service';
import { CesarService } from './cesar.service';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from './message.model';





@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent{
  [x: string]: any;
  messageList:  string[] = [];
  messageList2:  Message[] = [];
  message: string;
  nickN: string;
  oldMsg : string[] = [];
  msgObs: Observable<any>;
  channel : number;
  visible = "visible";
  msgr = "";

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  constructor(private socketService: SocketService, private cesarService : CesarService, private http: HttpClient) {
  }



    signup(nick: HTMLInputElement, pass:HTMLInputElement)
    {
      let passc  = this.cesarService.encode(pass.value, 10);
      this.socketService.signup(nick.value, passc);
    }

    signin(nick: HTMLInputElement, pass:HTMLInputElement)
    {
      let passc  = this.cesarService.encode(pass.value, 10);
      this.socketService.signin(nick.value, passc);
    }

    login = (login: boolean) => {

      if(login == true)
      {
        this.visible = "hide";
        console.log("logged in")
      }
    };




   sendMessage(message: HTMLInputElement, nick: HTMLInputElement, cnl:HTMLSelectElement) {
    let encoded = this.cesarService.encode(message.value, 10);
    this.socketService.sendMessage(nick.value, encoded, cnl.selectedIndex);
    //console.log("sent: " + message.value)
    message.value="";
    this.channel = cnl.selectedIndex;
  }


    chooseCnl(cnl:HTMLSelectElement) {
    this.socketService.chooseCnl(cnl.selectedIndex);
    console.log(cnl.selectedIndex)
    this.messageList2 = [];
    this.messageList = [];
    this.getOld();
  }


  getOld() {
    const url = 'https://3000-green-rook-ix0n3quq.ws-eu03.gitpod.io/requestoldmsg';
    const headers = new HttpHeaders("");
    this.msgObs = this.http.get(url, { headers });
    this.msgObs.subscribe(this.getOldData);
  }

  getOldData = (message: Message[]) => {
    console.log(message);
    for (let mesg of message)
    {
      mesg.messaggio = this.cesarService.decode(mesg.messaggio, 10)
      if(mesg.nickname == this.nickN)
      {
        mesg.msgr = "msgr";
      }
      this.messageList2.push(mesg);
    }
    console.log(this.messageList2);
  }

  scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch(err) { }
      }

  ngAfterViewChecked() {
        this.scrollToBottom();
    }

  getData = (message: string) => {
        this.message = message;
      };

  getCnl = (cnl: number) => {

    if(cnl == this.channel)
    {
      this.messageList.push(this.cesarService.decode(this.message, 10));

      console.log("messagereceived: " + this.message)
    }
        console.log("channel: " + cnl)
      };

  getUsr = (nick: string) => {

  };


  ngOnInit() {
    this.getOld();
    this.scrollToBottom();
    this.socketService.getCnl().subscribe(this.getCnl);
    this.socketService.getUsr().subscribe(this.getUsr);
    this.socketService.getMessage().subscribe(this.getData);
    this.socketService.login().subscribe(this.login);
  }
}
