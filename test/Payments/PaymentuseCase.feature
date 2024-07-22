Feature: Payment Use Case

  Scenario: Create a new payment successfully
    Given I have a valid payment data
    When I try to create a new payment
    Then the payment should be created successfully

  Scenario: Fail to create a new payment with invalid data
    Given I have invalid payment data
    When I try to create a new payment
    Then the creation should fail with an error message