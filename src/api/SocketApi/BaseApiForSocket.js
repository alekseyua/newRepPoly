class SocketBase {
  
  activate = () => {
    this.socket.onopen = (e) => {
      if (this.listeners['open']) {
        this.listeners['open']();
      }
    };
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.command)
        if (this.listeners[data.command]) { 
          this.listeners[data.command](event.data);
        } else {
          console.log('Тип события не определен!');
        }
    };
    this.socket.onclose = (event) => {
   
      if (this.listeners['disconnect']) {
        this.listeners['disconnect'](event);
        localStorage.setItem('connectionStatus', false);
      }
      setTimeout(this.activate, 2000);
    };
    this.socket.onerror = (error) => {
      if (this.listeners['error']) {
        this.listeners['error'](error);
        localStorage.setItem('connectionStatus', false);
      }
    };
  };

  on = (event, callback) => {
    this.listeners[event] = callback;
  };

  removeEventSocket = (eventName) => {
    delete this.listeners[eventName];
  };

  emit = (event, data = {}, key = 'type') => {
    this.socket.send(
      JSON.stringify({
        [key]: event,
        ...data,
      }),
    );
    return data;
  };

  init = (start, roomId) => {
    console.log('BASE_URI_FOR_SOCKET: inside init', BASE_URI_FOR_SOCKET)

    if (start) {
      this.roomId = roomId;
      this.coonectionURI = `${BASE_URI_FOR_SOCKET}/`;
      this.socket = new WebSocket(this.coonectionURI);
      this.listeners = {};
      this.activate();
      return this.socket;
    }
  };
}

export default SocketBase;
