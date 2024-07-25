import { Categories, Items } from '../collections';
import { ALL } from '/imports/utils/constants';

const pageSize = 15;

const queries = {
  async categories(_, args, context, info) {
    try {
      const result = await Categories.find();
      return result;
    } catch (error) {
      throw `categories Error: ${error}`;
    }
  },

  async item(_, args, context, info) {
    const _id = args._id;

    try {
      const result = await Items.findOne(_id);
      return result;
    } catch (error) {
      throw `ìtem Errors: ${error}`;
    }
  },

  async items(_, args, context, info) {
    const limit = pageSize;
    let skip = 0;
    let pageNumber = 0;

    let setFilters = {};
    let setOptions = {};

    if (args.pageNumber) pageNumber = Number(args.pageNumber);

    if (pageNumber <= 1) skip = 0;
    else skip = (pageNumber - 1) * limit;

    let search = '';
    if (args.search) search = args.search;
    if (search) setFilters.itemName = RegExp(search); // 중요함 RegExp()에 담아서 사용 Ex) 버거라고 입력해도 햄버거를검색해줌

    let itemCategoryId = '';
    if (args.itemCategoryId) itemCategoryId = args.itemCategoryId;
    if (itemCategoryId === ALL) itemCategoryId = '';
    if (itemCategoryId) setFilters.itemCategoryId = itemCategoryId;

    setOptions.limit = limit;
    setOptions.skip = skip;

    setOptions.sort = { createdAt: -1 }; // 내림차순 , 새로 등록된 상품이 앞에 옴

    try {
      //   await Meteor._sleepForMs(1000);
      const result = await Items.find(setFilters, setOptions);
      return result;
    } catch (error) {
      throw `items Errors: ${error}`;
    }
  },

  async itemPageCount(_, args, context, info) {
    let search = '';
    let setFilters = {};

    if (args.search) search = args.search;
    if (search) setFilters.itemName = RegExp(search);

    let itemCategoryId = '';
    if (args.itemCategoryId) itemCategoryId = args.itemCategoryId;
    if (itemCategoryId === ALL) itemCategoryId = '';
    if (itemCategoryId) setFilters.itemCategoryId = itemCategoryId;

    try {
      const totalItemCount = await Items.find(setFilters).count();
      const totalPage = Math.ceil(totalItemCount / pageSize); // 소수점 반올림

      return totalPage;
    } catch (error) {
      throw `itemPageCount Error: ${error}`;
    }
  },
};

export default queries;
