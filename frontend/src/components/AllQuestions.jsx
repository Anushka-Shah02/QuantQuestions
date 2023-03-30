import React, { useEffect, useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { FaList } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { MdLibraryAdd } from "react-icons/md";
import { Link } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Multiselect from "multiselect-react-dropdown";
import "./AllQuestions.css";

function AllQuestions() {
  const [css, setCss] = useState(true);
  const [mydata, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");
  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState("");
  const [ques, setQues] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [ansType, setAnsType] = useState("");
  const [answer, setAnswer] = useState("");
  const [explanation, setExplanation] = useState();
  const [searchVal, setSearchVal] = useState();
  const [enableSearch, setEnableSearch] = useState(false);
  const [selected, setSelected] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [firms, setFirms] = useState([]);
  const [positions, setPositions] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [tags, setTags] = useState([]);

  const [option1, setOption1] = useState();
  const [option2, setOption2] = useState();
  const [option3, setOption3] = useState();
  const [option4, setOption4] = useState();
  const [categories, setCategories] = useState();
  const [deletebtn, setDeleteBtn] = useState(false);
  const [quesId, setQuesId] = useState();
  const [categoryData, setCategoryData] = useState();
  const [loading, setLoading] = useState(false);

  const [removedFirm, setRemovedFirm] = useState([]);
  const [removedDivision, setRemovedDivision] = useState([]);
  const [removedPosition, setRemovedPosition] = useState([]);
  const [removedTag, setRemovedTag] = useState([]);

  const url = "http://localhost:8000/question";
  const category_url = "http://localhost:8000/category";

  const itemsPerPage = 10;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const tableData = selected && selected.slice(startIndex, endIndex);

  console.log(tableData);

  function goToPrev() {
    setCurrentPage((page) => page - 1);
  }

  function goToNext() {
    setCurrentPage((page) => page + 1);
  }

  const totalPages = Math.ceil(selected && selected.length / itemsPerPage);

  let firmNames = [],
    divisionNames = [],
    positionNames = [],
    tagNames = [];

  categories &&
    categories.firms.length > 0 &&
    categories.firms.map((data) => {
      firmNames.push(data.name);
    });
  categories &&
    categories.divisions.length > 0 &&
    categories.divisions.map((data) => {
      divisionNames.push(data.name);
    });
  categories &&
    categories.positions.length > 0 &&
    categories.positions.map((data) => {
      positionNames.push(data.name);
    });
  categories &&
    categories.tags.length > 0 &&
    categories.tags.map((data) => {
      tagNames.push(data.name);
    });

  const handleLogout = () => {
    localStorage.setItem("quantuser", null);
    window.location.href = "/";
  };

  const handleAdd = () => {
    setCss(false);
  };

  const fetchCategories = async () => {
    const data = await fetch(`${category_url}/getcategories`);
    const res = await data.json();
    setCategories(res);
  };

  const fetchQuestions = async () => {
    const data = await fetch(`${url}/getallquestions`);
    const res = await data.json();
    setData(res);
    setSelected(res);
  };

  useEffect(() => {
    fetchQuestions();
    fetchCategories();
    setLoading(false);
  }, [loading]);

  const setClicked = (id) => {
    setOpen(true);
    setId(id);
    setEdit(true);
    console.log(id);
  };

  const setCancel = () => {
    setOpen(false);
    setEdit(false);
  };

  const handleClick = (i) => {
    setClicked(i);
    setAnsType("");
  };

  const handleUpdate = async (id, catArray, options) => {
    // console.log(title, ques, option1, option2, option3, option4, id);
    // console.log(firms);
    // console.log(removedFirm);
    console.log(options, "KIKM");
    let value = {};
    if (ques) {
      value.question = ques;
    }
    if (title) {
      value.title = title;
    }
    if (category) {
      value.category = category;
    }
    if (difficulty) {
      value.difficulty = difficulty;
    }
    if (ansType) {
      value.answerType = ansType;
    }
    if (answer) {
      value.answer = answer;
    }
    if (explanation) {
      value.explanation = explanation;
    }
    if (option1 || option2 || option3 || option4) {
      let array = [];
      if (option1) {
        array.push(option1);
      } else {
        array.push(options[0]);
      }
      if (option2) {
        array.push(option2);
      } else {
        array.push(options[1]);
      }
      if (option3) {
        array.push(option3);
      } else {
        array.push(options[2]);
      }
      if (option4) {
        array.push(option4);
      } else {
        array.push(options[3]);
      }
      value.options = array;
    }

    if (removedFirm.length > 0 && firms.length > 0) {
      value.firms = firms;
    } else if (firms.length > 0) {
      value.firms = firms;
    } else if (removedFirm.length > 0) {
      let fval = [];
      catArray.firmArray.map((firm) => {
        if (!removedFirm.includes(firm)) {
          fval.push(firm);
        }
      });
      value.firms = fval;
    }

    if (removedDivision.length > 0 && divisions.length > 0) {
      value.divisions = divisions;
    } else if (divisions.length > 0) {
      value.divisions = divisions;
    } else if (removedDivision.length > 0) {
      let dval = [];
      catArray.divisionsArray.map((div) => {
        if (!removedDivision.includes(div)) {
          dval.push(div);
        }
      });
      value.divisions = dval;
    }

    if (removedPosition.length > 0 && positions.length > 0) {
      value.position = positions;
    } else if (positions.length > 0) {
      value.position = positions;
    } else if (removedPosition.length > 0) {
      let pval = [];
      catArray.positionsArray.map((pos) => {
        if (!removedPosition.includes(pos)) {
          pval.push(pos);
        }
      });
      value.position = pval;
    }

    if (removedTag.length > 0 && tags.length > 0) {
      value.tags = tags;
    } else if (tags.length > 0) {
      value.tags = tags;
    } else if (removedTag.length > 0) {
      let tval = [];
      catArray.tagsArray.map((tag) => {
        if (!removedTag.includes(tag)) {
          tval.push(tag);
        }
      });
      value.tags = tval;
    }

    console.log(value, "value");
    const updatedata = await fetch(
      `http://localhost:8000/question/update/questions/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(value),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }
    );
    const resup = await updatedata.json();
    console.log(resup);

    // console.log(catArray.firmArray)
    // console.log(firms)
    // console.log(removedFirm);
    // console.log(firmNames)

    let fdec = [],
      finc = [];
    if (removedFirm.length > 0 && firms.length > 0) {
      firmNames.map((firm) => {
        if (removedFirm.includes(firm) && firms.includes(firm)) {
          console.log(firm);
        } else if (
          removedFirm.includes(firm) &&
          catArray.firmArray.includes(firm)
        ) {
          fdec.push(firm);
        } else if (firms.includes(firm) && !catArray.firmArray.includes(firm)) {
          finc.push(firm);
        }
      });
    } else if (removedFirm.length > 0) {
      firmNames.map((firm) => {
        if (removedFirm.includes(firm)) {
          fdec.push(firm);
        }
      });
    } else if (firms.length > 0) {
      firmNames.map((firm) => {
        if (firms.includes(firm) && !catArray.firmArray.includes(firm)) {
          finc.push(firm);
        }
      });
    }

    let ddec = [],
      dinc = [];
    if (removedDivision.length > 0 && divisions.length > 0) {
      divisionNames.map((div) => {
        if (removedDivision.includes(div) && divisions.includes(div)) {
          console.log(div);
        } else if (
          removedDivision.includes(div) &&
          catArray.divisionsArray.includes(div)
        ) {
          ddec.push(div);
        } else if (
          divisions.includes(div) &&
          !catArray.divisionsArray.includes(div)
        ) {
          dinc.push(div);
        }
      });
    } else if (removedDivision.length > 0) {
      divisionNames.map((div) => {
        if (removedDivision.includes(div)) {
          ddec.push(div);
        }
      });
    } else if (divisions.length > 0) {
      divisionNames.map((div) => {
        if (divisions.includes(div) && !catArray.divisionsArray.includes(div)) {
          dinc.push(div);
        }
      });
    }

    let pdec = [],
      pinc = [];
    if (removedPosition.length > 0 && positions.length > 0) {
      positionNames.map((pos) => {
        if (removedPosition.includes(pos) && positions.includes(pos)) {
          console.log(pos);
        } else if (
          removedPosition.includes(pos) &&
          catArray.positionsArray.includes(pos)
        ) {
          pdec.push(pos);
        } else if (
          positions.includes(pos) &&
          !catArray.positionsArray.includes(pos)
        ) {
          pinc.push(pos);
        }
      });
    } else if (removedPosition.length > 0) {
      positionNames.map((pos) => {
        if (removedPosition.includes(pos)) {
          pdec.push(pos);
        }
      });
    } else if (positions.length > 0) {
      positionNames.map((pos) => {
        if (positions.includes(pos) && !catArray.positionsArray.includes(pos)) {
          pinc.push(pos);
        }
      });
    }

    let tdec = [],
      tinc = [];
    if (removedTag.length > 0 && tags.length > 0) {
      tagNames.map((tag) => {
        if (removedTag.includes(tag) && tags.includes(tag)) {
          console.log(tag);
        } else if (
          removedTag.includes(tag) &&
          catArray.tagsArray.includes(tag)
        ) {
          tdec.push(tag);
        } else if (tags.includes(tag) && !catArray.tagsArray.includes(tag)) {
          tinc.push(tag);
        }
      });
    } else if (removedTag.length > 0) {
      tagNames.map((tag) => {
        if (removedTag.includes(tag)) {
          tdec.push(tag);
        }
      });
    } else if (tags.length > 0) {
      tagNames.map((tag) => {
        if (tags.includes(tag) && !catArray.tagsArray.includes(tag)) {
          tinc.push(tag);
        }
      });
    }

    // console.log(fdec,finc);
    // console.log(ddec,dinc);
    // console.log(pdec,pinc);
    // console.log(tdec,tinc);

    const data = await fetch("http://localhost:8000/category/getcategories");
    const res = await data.json();
    let firmscount = [],
      divisionscount = [],
      positionscount = [],
      tagscount = [];
    res.firms.map((data) => {
      if (fdec.length > 0) {
        if (fdec.includes(data.name)) {
          let val = {
            name: data.name,
            count: data.count - 1,
          };
          firmscount.push(val);
        }
      }
      if (finc.length > 0) {
        if (finc.includes(data.name)) {
          let val = {
            name: data.name,
            count: data.count + 1,
          };
          firmscount.push(val);
        }
      }
    });

    res.divisions.map((data) => {
      if (ddec.length > 0) {
        if (ddec.includes(data.name)) {
          let val = {
            name: data.name,
            count: data.count - 1,
          };
          divisionscount.push(val);
        }
      }
      if (dinc.length > 0) {
        if (dinc.includes(data.name)) {
          let val = {
            name: data.name,
            count: data.count + 1,
          };
          divisionscount.push(val);
        }
      }
    });

    res.positions.map((data) => {
      if (pdec.length > 0) {
        if (pdec.includes(data.name)) {
          let val = {
            name: data.name,
            count: data.count - 1,
          };
          positionscount.push(val);
        }
      }
      if (pinc.length > 0) {
        if (pinc.includes(data.name)) {
          let val = {
            name: data.name,
            count: data.count + 1,
          };
          positionscount.push(val);
        }
      }
    });

    res.tags.map((data) => {
      if (tdec.length > 0) {
        if (tdec.includes(data.name)) {
          let val = {
            name: data.name,
            count: data.count - 1,
          };
          tagscount.push(val);
        }
      }
      if (tinc.length > 0) {
        if (tinc.includes(data.name)) {
          let val = {
            name: data.name,
            count: data.count + 1,
          };
          tagscount.push(val);
        }
      }
    });

    const val = {
      firmscount,
      divisionscount,
      tagscount,
      positionscount,
    };

    const dataa = await fetch(
      "http://localhost:8000/category/updatecategory/firms",
      {
        method: "PUT",
        body: JSON.stringify(val),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }
    );
    const response = await dataa.json();
    console.log(response);

    setLoading(true);
    setOpen(false);
    setEdit(false);
  };

  const handleDelete = (id) => {
    setQuesId(id);
    setDeleteBtn(true);
  };

  const handleDeleteQuestion = async () => {
    console.log(quesId);
    const dataa = await fetch("http://localhost:8000/category/getcategories");
    const resp = await dataa.json();
    let firmscount = [],
      divisionscount = [],
      positionscount = [],
      tagscount = [];
    resp.firms.map((data) => {
      if (categoryData.firmArray.includes(data.name)) {
        let val = {
          name: data.name,
          count: data.count - 1,
        };
        firmscount.push(val);
      }
    });
    resp.divisions.map((data) => {
      if (categoryData.divisionsArray.includes(data.name)) {
        let val = {
          name: data.name,
          count: data.count - 1,
        };
        divisionscount.push(val);
      }
    });
    resp.positions.map((data) => {
      if (categoryData.positionsArray.includes(data.name)) {
        let val = {
          name: data.name,
          count: data.count - 1,
        };
        positionscount.push(val);
      }
    });
    resp.tags.map((data) => {
      if (categoryData.tagsArray.includes(data.name)) {
        let val = {
          name: data.name,
          count: data.count - 1,
        };
        tagscount.push(val);
      }
    });
    const value = {
      firmscount,
      divisionscount,
      tagscount,
      positionscount,
    };
    console.log(value);
    const deletedata = await fetch(`http://localhost:8000/question/${quesId}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    const deleted = await deletedata.json();
    console.log(deleted);
    const data = await fetch(
      "http://localhost:8000/category/updatecategory/firms",
      {
        method: "PUT",
        body: JSON.stringify(value),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }
    );
    const res = await data.json();
    console.log(res);
    setDeleteBtn(false);
    setLoading(true);
    setOpen(false);
    setEdit(false);
  };

  // search questions
  const matched = [];
  const searchHandler = (e) => {
    if (e.target.value != "") {
      let val = e.target.value;
      mydata.forEach((ques) => {
        const value = ques.title.toLowerCase().includes(val.toLowerCase());
        if (value) {
          matched.push(ques);
        }
      });
      let uniquematched = [];
      matched.map((item) => {
        var findItem = uniquematched.find((x) => x._id === item._id);
        if (!findItem) uniquematched.push(item);
      });
      setSelected(uniquematched);
    } else {
      setSelected(mydata);
    }
  };

  return (
    <div>
      <div className="dash">
        <div className="dash-left">
          <div className="dash-head">Admin Panel</div>
          <div className="side-que">
            <Link to="/dashboard" className="add-que" onClick={handleAdd}>
              <MdLibraryAdd className="icon-side" />
              Add Questions
            </Link>

            <div className={css ? "add-que-hover" : "add-que"}>
              <FaList className="icon-side" />
              All Questions
            </div>

            <div className="add-que" onClick={handleLogout}>
              <FiLogOut className="icon-side" />
              Logout
            </div>
          </div>
        </div>

        <div className="dash-right">
          <div className="ad-nav">
            <div className="admin-name">
              Khushi Agrawal
              <FaUserCircle className="" size="25" />
            </div>
          </div>

          <div className="admin-func">
            <div className="disp-all-ques">
              <div className="search-all">
                <input
                  type="text"
                  value={searchVal}
                  onChange={searchHandler}
                  placeholder="Search questions..."
                  className="search-in"
                />
              </div>
              {tableData &&
                tableData.map((data, index) => (
                  <div key={index}>
                    <div
                      className={
                        edit && index === id ? "all-edit-drop" : "all-ques-drop"
                      }
                    >
                      <div>
                        <div className="ques1-drop">
                          {edit && index === id ? (
                            <div className="ques-d">
                              <span className="span-tag">Title:</span>

                              <textarea
                                className="quest1"
                                type="text"
                                // value={data.title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder={data.title}
                              />
                            </div>
                          ) : (
                            <div>{data.title}</div>
                          )}

                          <div className="additionals">
                            <FiEdit
                              onClick={() => handleClick(index)}
                              size="20"
                              className=""
                            />
                            <MdDelete
                              size="20"
                              onClick={() => {
                                setCategoryData({
                                  firmArray: data.firms,
                                  divisionsArray: data.divisions,
                                  positionsArray: data.position,
                                  tagsArray: data.tags,
                                });
                                handleDelete(data._id);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      {open && index === id && (
                        <div>
                          {/* {data.answerType === "Text" ? ( */}
                          <div>
                            <div className="detail-ques">
                              <div>
                                <span className="span-tag span-ques">
                                  Question:
                                </span>
                                <textarea
                                  className="quest1"
                                  type="text"
                                  value={ques}
                                  onChange={(e) => setQues(e.target.value)}
                                  placeholder={data.question}
                                />{" "}
                              </div>
                              <div>
                                <span className="span-tag">Category : </span>
                                <select
                                  name="category"
                                  className="opt-font selection"
                                  required
                                  onChange={(e) => setCategory(e.target.value)}
                                >
                                  <option value="none" selected disabled hidden>
                                    {data.category}
                                  </option>
                                  {categories &&
                                    categories.category.map((category, i) => (
                                      <option key={i} value={category.name}>
                                        {category.name}
                                      </option>
                                    ))}
                                </select>
                              </div>

                              <div>
                                <span className="span-tag">Difficulty: </span>
                                <select
                                  name="difficulty"
                                  className="opt-font selection"
                                  required
                                  onChange={(e) =>
                                    setDifficulty(e.target.value)
                                  }
                                >
                                  <option value="none" selected disabled hidden>
                                    {data.difficulty}
                                  </option>
                                  <option value="easy">Easy</option>
                                  <option value="medium">Medium</option>
                                  <option value="hard">Hard</option>
                                </select>
                              </div>

                              <div>
                                <span className="span-tag">Answer Type: </span>
                                <select
                                  name="answerType"
                                  className="opt-font selection"
                                  required
                                  onChange={(e) => setAnsType(e.target.value)}
                                >
                                  <option value="none" selected disabled hidden>
                                    {data.answerType}
                                  </option>
                                  {categories &&
                                    categories.answerType.map((ans, i) => (
                                      <option key={i} value={ans.name}>
                                        {ans.name}
                                      </option>
                                    ))}
                                </select>
                              </div>
                              {ansType == "Mcq" && data.answerType != "Mcq" && (
                                <>
                                  <div>
                                    <span className="span-tag">Option 1:</span>
                                    <input
                                      type="text"
                                      onChange={(e) =>
                                        setOption1(e.target.value)
                                      }
                                      placeholder=""
                                    />
                                  </div>
                                  <div>
                                    <span className="span-tag">Option 2:</span>
                                    <input
                                      type="text"
                                      onChange={(e) =>
                                        setOption2(e.target.value)
                                      }
                                      placeholder=""
                                    />
                                  </div>
                                  <div>
                                    <span className="span-tag">Option 3:</span>
                                    <input
                                      type="text"
                                      onChange={(e) =>
                                        setOption3(e.target.value)
                                      }
                                      placeholder=""
                                    />
                                  </div>
                                  <div>
                                    <span className="span-tag">Option 4:</span>
                                    <input
                                      type="text"
                                      onChange={(e) =>
                                        setOption4(e.target.value)
                                      }
                                      placeholder=""
                                    />
                                  </div>
                                </>
                              )}
                              {data.answerType == "Mcq" && (
                                <div>
                                  <span className="span-tag">Option 1:</span>
                                  <input
                                    type="text"
                                    onChange={(e) => setOption1(e.target.value)}
                                    placeholder={
                                      data.options[0] ? data.options[0] : ""
                                    }
                                  />
                                </div>
                              )}
                              {data.answerType == "Mcq" && (
                                <div>
                                  <span className="span-tag">Option 2:</span>
                                  <input
                                    type="text"
                                    onChange={(e) => setOption2(e.target.value)}
                                    placeholder={
                                      data.options[1] ? data.options[1] : ""
                                    }
                                  />
                                </div>
                              )}
                              {data.answerType == "Mcq" && (
                                <div>
                                  <span className="span-tag">Option 3:</span>
                                  <input
                                    type="text"
                                    onChange={(e) => setOption3(e.target.value)}
                                    placeholder={
                                      data.options[2] ? data.options[2] : ""
                                    }
                                  />
                                </div>
                              )}
                              {data.answerType == "Mcq" && (
                                <div>
                                  <span className="span-tag">Option 4:</span>
                                  <input
                                    type="text"
                                    onChange={(e) => setOption4(e.target.value)}
                                    placeholder={
                                      data.options[3] ? data.options[3] : ""
                                    }
                                  />
                                </div>
                              )}
                              <div>
                                <span className="span-tag">Answer:</span>
                                <input
                                  type="text"
                                  value={answer}
                                  onChange={(e) => setAnswer(e.target.value)}
                                  placeholder={data.answer}
                                />{" "}
                              </div>
                              <div>
                                <span className="span-tag">Explanation:</span>
                                <textarea
                                  type="text"
                                  value={explanation}
                                  onChange={(e) =>
                                    setExplanation(e.target.value)
                                  }
                                  placeholder={data.explanation}
                                />{" "}
                              </div>
                              <div>
                                <span className="span-tag">Firms:</span>
                                <div className="form-outline flex-fill mb-0">
                                  <Multiselect
                                    placeholder="Select Firms"
                                    displayValue=""
                                    isObject={false}
                                    onKeyPressFn={function noRefCheck() {}}
                                    onSearch={function noRefCheck() {}}
                                    onSelect={(name) => setFirms(name)}
                                    onRemove={(name, removedItem) => {
                                      setRemovedFirm((arr) => [
                                        ...arr,
                                        removedItem,
                                      ]);
                                    }}
                                    options={firmNames}
                                    selectedValues={data.firms}
                                  />
                                </div>
                              </div>

                              <div>
                                <span className="span-tag">Division:</span>
                                <Multiselect
                                  placeholder="Select Divisions"
                                  displayValue=""
                                  isObject={false}
                                  onKeyPressFn={function noRefCheck() {}}
                                  onRemove={(name, removedItem) => {
                                    setRemovedDivision((arr) => [
                                      ...arr,
                                      removedItem,
                                    ]);
                                  }}
                                  onSearch={function noRefCheck() {}}
                                  onSelect={(name) => setDivisions(name)}
                                  options={divisionNames}
                                  selectedValues={data.divisions}
                                />
                              </div>
                              <div>
                                <span className="span-tag">Position:</span>
                                <Multiselect
                                  placeholder="Select Positions"
                                  displayValue=""
                                  isObject={false}
                                  onKeyPressFn={function noRefCheck() {}}
                                  onRemove={(name, removedItem) => {
                                    setRemovedPosition((arr) => [
                                      ...arr,
                                      removedItem,
                                    ]);
                                  }}
                                  onSearch={function noRefCheck() {}}
                                  onSelect={(name) => setPositions(name)}
                                  options={positionNames}
                                  selectedValues={data.position}
                                />
                              </div>
                              <div>
                                <span className="span-tag">Tags:</span>
                                <Multiselect
                                  placeholder={data.tags}
                                  displayValue=""
                                  isObject={false}
                                  onKeyPressFn={function noRefCheck() {}}
                                  onRemove={(name, removedItem) => {
                                    setRemovedTag((arr) => [
                                      ...arr,
                                      removedItem,
                                    ]);
                                  }}
                                  onSearch={function noRefCheck() {}}
                                  onSelect={(name) => setTags(name)}
                                  options={tagNames}
                                  selectedValues={data.tags}
                                />
                              </div>
                            </div>
                            <div className="add-ons">
                              <button
                                className="add-btn-save"
                                onClick={() =>
                                  handleUpdate(
                                    data._id,
                                    {
                                      firmArray: data.firms,
                                      divisionsArray: data.divisions,
                                      positionsArray: data.position,
                                      tagsArray: data.tags,
                                    },
                                    data.options
                                  )
                                }
                              >
                                Save
                              </button>
                              <button
                                className="add-btn-save"
                                onClick={setCancel}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

              { tableData.length>0 ? 
                <nav className="d-flex justify-content-center">
                <ul className="pagination">
                  <button
                    onClick={goToPrev}
                    className="prev"
                    disabled={currentPage === 1}
                  >
                    <IoIosArrowBack fontSize={20} />
                    Prev
                  </button>
                  <p className="nums">
                    {selected && selected.length > 0
                      ? `${currentPage}/${totalPages}`
                      : "0/0"}
                  </p>
                  <button
                    onClick={goToNext}
                    className="next"
                    disabled={currentPage >= totalPages}
                  >
                    Next
                    <IoIosArrowForward fontSize={20} />
                  </button>
                </ul>
              </nav>:
              <div className="d-flex justify-content-center">No Data Found</div>
              }
              
            </div>
          </div>

          {deletebtn && (
            <Modal show={deletebtn} onHide={() => setDeleteBtn(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Are you sure?</Modal.Title>
              </Modal.Header>
              <Modal.Body className="">
                Do you really want to delete this question? This process cannot
                be undone.
              </Modal.Body>
              <Modal.Footer>
                <Button variant="danger" onClick={handleDeleteQuestion}>
                  Delete
                </Button>
                <Button variant="light" onClick={() => setDeleteBtn(false)}>
                  Cancel
                </Button>
              </Modal.Footer>
            </Modal>
          )}
        </div>
      </div>
    </div>
  );
}

export default AllQuestions;
