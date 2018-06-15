declare module 'highoutput-stripe' {
  declare type Card = {
    userId: string,
    stripeId: string,
    cardId: string,
    sourceId: string,
  };

  declare type User = {
    userId: string,
    stripeId: string,
    email: string,
  }

  declare interface Model {
    retrieveUserbyId(userId: string): Promise<User>;
    bindStripeToUser(card: Card): Promise<Card>;
    retrieveCard(cardId: string, userId: string): Promise<Card>;
  }

  declare class Stripe {
    constructor({
      key: string,
      model: Model,
    }): Stripe;
    createCard({
      userId: string,
      sourceId: string,
      description: string,
    }): Promise<Card>;
    updateCard({
      userId: string,
      cardId: string,
      address_city?: string,
      address_country?: string,
      address_line1?: string,
      address_line2?: string,
      address_state?: string,
      address_zip?: string,
      exp_month?: string,
      exp_year?: string,
      name?: string,
    }): Promise<Card>;
    deleteCard({
      userId: string,
      cardId: string,
    }): Promise<boolean>;
    chargeCard({
      userId: string,
      cardId: string,
      amount: string,
      description: string,
    }): Promise<boolean>;
  }

  declare export default typeof Stripe;
  declare export Card;
  declare export Model;
}
