import { InjectionToken } from '@angular/core';
import { ILoadingService } from './loading.service.interface';
import { IMessagesService } from './messages.service.interface';

// Déclarations des tokens pour l'injection de dépendances
export const ILoadingServiceToken = new InjectionToken<ILoadingService>('ILoadingServiceToken');
export const IMessagesServiceToken = new InjectionToken<IMessagesService>('IMessagesServiceToken');
