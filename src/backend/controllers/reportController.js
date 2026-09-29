import db from "../db.js";


// ======================================================
// GET SALES REPORT
// ======================================================

export const getReports = async (req, res) => {

  try {

    // ==================================================
    // GET SALES REPORT TABLE DATA
    // ==================================================

    const [reports] = await db.query(`

      SELECT

        o.order_id AS id,

        DATE_FORMAT(
          o.order_date,
          '%d-%m-%Y'
        ) AS date,

        c.customer_name AS customer,

        p.product_name AS product,

        o.quantity AS quantity,

        o.total_amount AS amount

      FROM orders o

      INNER JOIN customer c
        ON o.customer_id = c.customer_id

      INNER JOIN products p
        ON o.product_id = p.product_id

      ORDER BY
        o.order_date DESC,
        o.order_id DESC

    `);


    // ==================================================
    // TOTAL SALES
    // ==================================================

    const [salesResult] = await db.query(`

      SELECT

        COALESCE(
          SUM(quantity),
          0
        ) AS totalSales

      FROM orders

    `);


    // ==================================================
    // TOTAL REVENUE
    // ==================================================

    const [revenueResult] = await db.query(`

      SELECT

        COALESCE(
          SUM(total_amount),
          0
        ) AS totalRevenue

      FROM orders

    `);


    // ==================================================
    // TOTAL CUSTOMERS
    // ==================================================

    const [customerResult] = await db.query(`

      SELECT

        COUNT(
          DISTINCT customer_id
        ) AS customers

      FROM orders

    `);


    // ==================================================
    // BEST SELLING PRODUCT
    // ==================================================

    const [bestSellerResult] = await db.query(`

      SELECT

        p.product_name AS product,

        SUM(o.quantity) AS total_quantity

      FROM orders o

      INNER JOIN products p
        ON o.product_id = p.product_id

      GROUP BY

        o.product_id,
        p.product_name

      ORDER BY

        total_quantity DESC

      LIMIT 1

    `);


    // ==================================================
    // SEND RESPONSE
    // ==================================================

    res.json({

      success: true,

      summary: {

        totalSales:
          Number(
            salesResult[0].totalSales
          ),

        totalRevenue:
          Number(
            revenueResult[0].totalRevenue
          ),

        customers:
          Number(
            customerResult[0].customers
          ),

        bestSeller:
          bestSellerResult.length > 0
            ? bestSellerResult[0].product
            : "N/A"

      },

      reports:

        reports.map((report) => ({

          id:
            report.id,

          date:
            report.date,

          customer:
            report.customer,

          product:
            report.product,

          quantity:
            Number(
              report.quantity
            ),

          amount:
            Number(
              report.amount
            )

        }))

    });

  }

  catch (error) {

    console.error(
      "Error fetching sales reports:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        "Failed to fetch sales reports",

      error:
        error.message

    });

  }

};