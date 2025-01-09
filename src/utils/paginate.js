/**
 * Paginate function to handle pagination for Sequelize models.
 *
 * @param {Object} model - The Sequelize model to query.
 * @param {number} [page=1] - The current page number.
 * @param {number} [limit=10] - The number of items per page.
 * @param {Object} [search={}] - The search conditions to apply.
 * @param {Array} [order=[]] - The sorting order (e.g., [['column', 'ASC']]).
 * @param {Function} [transform] - An optional function to transform the rows before returning.
 * @returns {Promise<Object>} An object containing pagination details and the data.
 * @throws Will log any errors encountered during execution.
 */

const paginate = async (model, page = 1, limit = 10, search = {}, order = [], transform) => {
    try {
        // Prepare the options object for Sequelize's `findAndCountAll` method
        const options = {
            offset: getOffset(page, limit), 
            limit,
        };

        // Add search conditions to the options if provided
        if (Object.keys(search).length) options.search = search; 

        // Add sorting options to the query if provided
        if (order && order.length) options["order"] = order;

        // Execute the query using Sequelize's `findAndCountAll` method
        const { count, rows } = await model.findAndCountAll(options);

        // If a transform function is provided, apply it to the rows
        if (transform && typeof transform === "function") {
            rows = transform(rows); // Transform the rows as needed
        }

        // Return the pagination details and the data
        return {
            previousPage: getPreviousPage(page),
            currentPage: page,
            nextPage: getNextPage(page, limit, count),
            total: count, 
            limit: limit, 
            data: rows,
        };
    } catch (error) {
        console.log(error);
    }
};

const getOffset = (page, limit) => {
    return page * limit - limit;
};

const getNextPage = (page, limit, total) => {
    if (total / limit > page) {
        return page + 1;
    }

    return null;
};

const getPreviousPage = (page) => {
    if (page <= 1) {
        return null;
    }
    return page - 1;
};

module.exports = paginate;
