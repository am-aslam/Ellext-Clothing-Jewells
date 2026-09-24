import test from 'node:test';
import assert from 'node:assert/strict';
import { canTransition } from '../src/domain/order-status';

test('accepts the normal fulfilment path', () => {
  assert.equal(canTransition('PLACED', 'CONFIRMED'), true);
  assert.equal(canTransition('CONFIRMED', 'PACKED'), true);
  assert.equal(canTransition('SHIPPED', 'OUT_FOR_DELIVERY'), true);
  assert.equal(canTransition('OUT_FOR_DELIVERY', 'DELIVERED'), true);
});

test('rejects invalid order jumps and changes after refund', () => {
  assert.equal(canTransition('PLACED', 'DELIVERED'), false);
  assert.equal(canTransition('DELIVERED', 'SHIPPED'), false);
  assert.equal(canTransition('REFUNDED', 'PLACED'), false);
});
