Feature: PubSub
  As a developer
  I want to send a message from a remote publisher and all the subscribers should receive the message

  Scenario: Multiple Subscribers
    Given a single publisher and multiple subscribers
    When I send a message from the publisher
    Then all subscribers should receive the same message

  Scenario: General Topic
    Given multiple publishers with different topics and a subscriber with topic that matches all topics set by publishers
    When I send a message from each of the publishers
    Then the subscriber should receive all messages

  Scenario: Specific Topic
    Given multiple publishers with different topics and a subscriber with topic that matches the topic set by one of the publishers
    When I send a message from each of the publishers
    Then the subscriber should receive only the message sent by one of the publishers
