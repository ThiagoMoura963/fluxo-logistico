exports.up = (pgm) => {
  pgm.createTable("warehouse_schedules", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },

    schedule_date: {
      type: "date",
      notNull: true,
    },

    schedule_time: {
      type: "time",
      notNull: false,
    },

    client: {
      type: "varchar(100)",
      notNull: true,
    },

    booking: {
      type: "varchar(100)",
      notNull: false,
    },

    inspectorate: {
      type: "varchar(255)",
      notNull: false,
    },

    operation_type: {
      type: "varchar(100)",
      notNull: true,
    },

    commodity: {
      type: "varchar(255)",
      notNull: true,
    },

    quantity: {
      type: "integer",
      notNull: true,
      check: "quantity >= 0",
    },

    completed: {
      type: "integer",
      notNull: true,
      default: 0,
      check: "completed >= 0",
    },

    notes: {
      type: "text",
      notNull: false,
    },

    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },

    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },
  });
};

exports.down = false;
