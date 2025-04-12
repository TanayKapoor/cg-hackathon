import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LeaveRequest {
  type: string;
  startDate: Date;
  endDate: Date;
  reason?: string;
}

export interface ChatMessage {
  from: 'user' | 'bot';
  text: string;
  timestamp?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = '/api'; // Replace with your actual API URL

  constructor(private http: HttpClient) { }

  postHelp(query: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/help`, { query });
  }

  submitLeave(data: LeaveRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/leave`, data);
  }
} 