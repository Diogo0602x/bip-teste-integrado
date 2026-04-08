import { FeedbackType } from './feedback-type.enum';

describe('FeedbackType', () => {
  it('valores string', () => {
    expect(FeedbackType.Success).toBe('success');
    expect(FeedbackType.Error).toBe('error');
    expect(FeedbackType.Warning).toBe('warning');
  });
});
