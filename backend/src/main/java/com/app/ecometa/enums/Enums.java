package com.app.ecometa.enums;

public class Enums {

	public enum Role {
		USER, RECYCLER, ADMIN;
	}

	public enum EwasteType {
		LAPTOP, PHONE, BATTERY, TV, APPLIANCE, OTHER
	}

	public enum Condition {
		WORKING, BROKEN, PARTIALLY_WORKING, NON_FUNCTIONAL, SCRAP, UNKNOWN
	}

	public enum Status {
		SUBMITTED, ACCEPTED, COLLECTED, RECYCLED, REJECTED, CANCELLED, PENDING, FAILED_PICKUP
	}
}
