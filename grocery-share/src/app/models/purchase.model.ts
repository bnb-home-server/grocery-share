export interface Purchase {
  id?: number;
  establishment: string;
  is_completed: number;
  created_at: string;
}

export interface PurchasePerson {
  purchase_id: number;
  person_id: number;
}

export interface PurchaseWithPeople extends Purchase {
  people: number[];
}
