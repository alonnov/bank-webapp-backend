import { createPW } from '../../../src/utils/password';

describe('Password Utils', () => {
  describe('createPW', () => {
    it('should hash a password', async () => {
      const password = 'testPassword123';
      const hashedPassword = await createPW(password);
      
      expect(hashedPassword).toBeDefined();
      expect(typeof hashedPassword).toBe('string');
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(0);
    });

    it('should produce different hashes for the same password', async () => {
      const password = 'testPassword123';
      const hash1 = await createPW(password);
      const hash2 = await createPW(password);
      
      expect(hash1).not.toBe(hash2);
    });
  });
}); 