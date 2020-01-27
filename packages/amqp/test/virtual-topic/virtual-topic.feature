Feature: Virtual Topic

  Scenario: Single Worker
    Given a publisher and a worker with virtual topics
    When I send a message from the publisher with the virtual topic
    Then the worker should receive the message
