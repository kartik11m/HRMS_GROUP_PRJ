import pool from "./db/db.js";

const checkUsers = async () => {
    try {
        const res = await pool.query("SELECT fullname FROM users");
        const found = res.rows.filter(u => u.fullname.toLowerCase().includes('nishank'));

        if (found.length > 0) {
            console.log("FOUND_MATCHES:", found.map(f => f.fullname).join(", "));
        } else {
            console.log("NO_MATCHES_FOUND");
        }
    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
};

checkUsers();
