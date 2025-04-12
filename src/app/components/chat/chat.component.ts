import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageBubbleComponent } from '../message-bubble/message-bubble.component';
import { LeaveFormComponent } from '../leave-form/leave-form.component';
import { ChatService, ChatMessage, LeaveRequest } from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, MessageBubbleComponent, LeaveFormComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit {
  messages: ChatMessage[] = [];
  userInput = '';
  showLeaveForm = false;
  loading = false;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    // Add welcome message
    this.messages.push({
      from: 'bot',
      text: 'Hello! I am your HR assistant. How can I help you today?',
      timestamp: new Date()
    });
  }

  sendMessage(): void {
    if (!this.userInput.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      from: 'user',
      text: this.userInput,
      timestamp: new Date()
    };
    this.messages.push(userMessage);
    
    // Clear input field
    const query = this.userInput;
    this.userInput = '';
    
    // Show loading state
    this.loading = true;
    
    // Send to backend
    this.chatService.postHelp(query).subscribe({
      next: (response) => {
        // Add bot response
        this.messages.push({
          from: 'bot',
          text: response.message || 'I received your message.',
          timestamp: new Date()
        });
        this.loading = false;
      },
      error: (error) => {
        // Add error message
        this.messages.push({
          from: 'bot',
          text: 'Sorry, I encountered an error. Please try again later.',
          timestamp: new Date()
        });
        console.error('Error sending message:', error);
        this.loading = false;
      }
    });
  }

  toggleLeaveForm(): void {
    this.showLeaveForm = !this.showLeaveForm;
  }

  handleLeaveSubmit(leaveData: LeaveRequest): void {
    this.showLeaveForm = false;
    
    // Add user message about leave request
    this.messages.push({
      from: 'user',
      text: `I'd like to request ${leaveData.type} from ${new Date(leaveData.startDate).toLocaleDateString()} to ${new Date(leaveData.endDate).toLocaleDateString()}`,
      timestamp: new Date()
    });
    
    // Show loading state
    this.loading = true;
    
    // Send to backend
    this.chatService.submitLeave(leaveData).subscribe({
      next: (response) => {
        // Add bot response
        this.messages.push({
          from: 'bot',
          text: response.message || 'Your leave request has been submitted.',
          timestamp: new Date()
        });
        this.loading = false;
      },
      error: (error) => {
        // Add error message
        this.messages.push({
          from: 'bot',
          text: 'Sorry, I encountered an error submitting your leave request. Please try again later.',
          timestamp: new Date()
        });
        console.error('Error submitting leave:', error);
        this.loading = false;
      }
    });
  }

  handleLeaveCancel(): void {
    this.showLeaveForm = false;
  }
}
