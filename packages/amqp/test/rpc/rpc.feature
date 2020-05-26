Feature: RPC
  As a developer
  I want to send a message from a remote client into a remote worker and wait for result

  Scenario Outline: Simple RPC
    Given a client and a worker
    And the worker responds with <response>
    When I send <message> message from the client
    Then I should receive <message> on the worker
    And I should receive <response> on the client

    Examples:
      | message           | response          |
      | "Hello World"     | null              |
      | 25                | null              |
      | true              | null              |
      | { "value": true } | null              |
      | [ 1, 2, 3, 4 ]    | null              |
      | null              | "Hello World"     |
      | null              | 25                |
      | null              | true              |
      | null              | { "value": true } |
      | null              | [ 1, 2, 3, 4 ]    |

  Scenario: Multiple Workers
    Given a single client and multiple workers
    When I send multiple messages from the client
    Then the messages should be distributed into all of the workers

  Scenario: Worker Failure
    Given a single client and multiple workers with delayed response
    When I send multiple messages from the client asynchronously
    And one of the workers is stopped
    Then all messages should be handled

  Scenario: Multiple Clients
    Given multiple clients and a single worker
    When I send multiple messages from each of the clients
    Then the worker should receive all the messages sent by all the clients

  Scenario Outline: Queueing
    Given a worker with a concurrency of <concurrency>
    And the worker handles each message for 200 milliseconds
    When I send 4 message(s) from the client
    Then all the messages should be handled in about <duration> milliseconds

    Examples:
      | concurrency | duration |
      | 1           | 800      |
      | 2           | 400      |
      | 4           | 200      |

  Scenario Outline: Serialization
    Given a client and a worker
    And a message that contains class objects
    When I send a <type> from the client
    Then the worker should also receive a <type>

    Examples:
      | type   |
      | Buffer |
      | Set    |
      | Map    |
      | Date   |
