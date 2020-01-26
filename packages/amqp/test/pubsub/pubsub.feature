Feature: PubSub
  As a developer
  I want to send a message from a remote publisher and all the subscribers should receive the message

  @only
  Scenario: Multiple Subscribers
    Given a single publisher and multiple subscribers
    When I send a message from the publisher
    Then all subscribers should receive the same message
