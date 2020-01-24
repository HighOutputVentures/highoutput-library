Feature: RPC
  As a developer
  I want to send a message from a remote client into a remote worker and wait for result

  Scenario Outline: Simple RPC
    Given a client and a worker in the same scope
    And the worker responds with <response>
    When I send <message> from the client
    Then I should receive <message> on the worker
    And I should receive <response> on the client

    Examples:
      | message             | response          |
      | "Hello World"       | null              |
      | 25                  | null              |
      | true                | null              |
      | { "value": true }   | null              |
      | [ 1, 2, 3, 4 ]      | null              |
      | null                | "Hello World"     |
      | null                | 25                |
      | null                | true              |
      | null                | { "value": true } |
      | null                | [ 1, 2, 3, 4 ]    |
