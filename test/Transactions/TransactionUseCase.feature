Feature: Transaction Use Case

  Scenario: Get transaction successfully
    Given I have a valid transaction data
    When I try get transaction
    Then the transaction should be successfully

  Scenario: Fail to get transaction with invalid data
    Given I have invalid transaction data
    When I try get transaction
    Then the transaction should fail with an error message