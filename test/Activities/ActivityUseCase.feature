Feature: Activity Use Case

  Scenario: Create a new activity successfully
    Given I have a valid activity data
    When I try to create a new activity
    Then the activity should be created successfully

  Scenario: Fail to create a new activity with invalid data
    Given I have invalid activity data
    When I try to create a new activity
    Then the creation should fail with an error message