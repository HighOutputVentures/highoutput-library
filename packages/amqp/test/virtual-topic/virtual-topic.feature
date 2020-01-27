Feature: Virtual Topic

  Scenario: Single Worker
    Given a publisher and a worker with virtual topics
    When I send a message from the publisher with the virtual topic
    Then the worker should receive the message

  Scenario: Multiple Workers
    Given a single publisher and multiple workers with queues that match the topic set by the publisher
    When I send a message from the publisher with the virtual topic
    Then all the workers should receive the message
