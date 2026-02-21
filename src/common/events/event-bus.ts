import { EventEmitter } from 'events';
import { logger } from '../../config/logger.config';

/**
 * In-Process EventBus — Lightweight, fire-and-forget events
 * BullMQ se alag: ye in-memory hai, server restart pe events lost
 *
 * Use EventBus for:
 *   - Cache invalidation (user update → Redis cache delete)
 *   - Activity logging (login → log likho)
 *   - Analytics updates (record delete → count update)
 *   - Notifications trigger
 *
 * Use BullMQ for (reliable, MUST complete):
 *   - Email sending (SMTP fail → retry)
 *   - Excel import (heavy, background)
 *   - Payment webhook (paise ka mamla)
 *
 * Usage:
 *   // Emit (non-blocking — response pehle jaata hai)
 *   eventBus.emitAsync('user:updated', { userId: '123' });
 *
 *   // Listen (register in module's event-handlers file)
 *   eventBus.on('user:updated', (payload) => {
 *     cache.del(`user:${payload.userId}`);
 *   });
 */

type EventPayload = Record<string, unknown>;
type EventHandler = (payload: EventPayload) => void | Promise<void>;

class AppEventBus extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(50);
  }

  /**
   * Non-blocking emit — deferred to next tick
   * Controller emit karo aur response bhejo — side-effects baad mein
   */
  emitAsync(event: string, payload: EventPayload): void {
    setImmediate(() => {
      try {
        this.emit(event, payload);
      } catch (err) {
        logger.error(`[EventBus] Error in handler for "${event}":`, err);
      }
    });
  }

  /**
   * Type-safe listener registration
   */
  register(event: string, handler: EventHandler): void {
    this.on(event, handler);
    logger.debug(`[EventBus] Registered handler for "${event}"`);
  }
}

export const eventBus = new AppEventBus();
