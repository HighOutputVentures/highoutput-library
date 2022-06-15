import http from 'http';

export const getRequestData = (request: http.IncomingMessage): any => 
  new Promise((resolve, reject) => {
    try {
      let body = '';

      request.on('data', (chunk: any) => {
        body += chunk.toString();
      });
      
      request.on('end', () => {
        resolve(body);
      });
    } catch (error) {
      reject(error);
    }
  });