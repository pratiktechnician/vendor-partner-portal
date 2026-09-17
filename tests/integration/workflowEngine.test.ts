import { getWorkflowForAmount, evaluateNextInvoiceStatus } from '../../lib/services/workflowEngine';

describe('Workflow Engine Routing Integration Tests', () => {
  test('Invoice <= 50,000 routes to 2-step workflow', () => {
    const workflow = getWorkflowForAmount(45000);
    expect(workflow.steps.length).toBe(2);
    expect(workflow.steps[0].required_role).toBe('doc_verifier');
    expect(workflow.steps[1].required_role).toBe('finance_officer');
  });

  test('Invoice > 500,000 routes to 4-step executive workflow', () => {
    const workflow = getWorkflowForAmount(600000);
    expect(workflow.steps.length).toBe(4);
    expect(workflow.steps[3].required_role).toBe('management');
  });

  test('Final approval step transitions status to approved_for_payment', () => {
    const result = evaluateNextInvoiceStatus('finance_approval_pending', 'approve', 'finance_officer', 45000, 2);
    expect(result.nextStatus).toBe('approved_for_payment');
    expect(result.isFinalApproval).toBe(true);
  });
});
