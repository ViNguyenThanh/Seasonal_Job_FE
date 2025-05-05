import React, { useEffect, useState } from 'react'
import './EmployerTransactions.css'
import avatar from '/assets/Work-On-Computer.png'
import { EyeOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Empty, Form, Input, InputNumber, message, Modal, Pagination, Select, Skeleton } from 'antd';
import { useNavigate } from 'react-router-dom';
import { paymentApi } from '../../../apis/payment.request';
import { formatDate } from '../../../utils/formatDate';
import { jobGroupApi } from '../../../apis/job-group.request';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { userApi } from '../../../apis/user.request';

const EmployerTransactions = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await paymentApi.getPaymentHistory();
        // console.log(res.data);
        const newTransactions = await Promise.all(res.data.data.map(async (item) => {
          const jobGroup = await jobGroupApi.getJobGroupById(item.jobGroupId);
          // console.log(jobGroup);
          return {
            id: item.id,
            jobGroupName: jobGroup.data.data.title,
            date: formatDate(item.createdAt),
            amount: parseFloat(item.amount).toLocaleString('vi-VN'),
            status: item.status,
            description: item.description,
            employerId: item.employerId,
            userId: item.userId,
            orderCode: item.orderCode,
            startDate: formatDate(jobGroup.data.data.start_date),
            endDate: formatDate(jobGroup.data.data.end_date)
          };
        }));
        // console.log(newTransactions);
        setIsLoading(false);
        setTransactions(newTransactions);
      } catch (error) {
        console.log(error);
        if (error.status === 404) {
          setTransactions([]);
          setIsLoading(false);
        }
        setIsLoading(false);
      }
    }
    fetchTransactions();

    const fetchWallet = async () => {
      try {
        const res = await paymentApi.getEscrowWallet();
        // console.log(res.data);
        setWalletBalance(res.data.balance);
      } catch (error) {
        console.log(error);
      }
    }
    fetchWallet();

    const fetchUser = async () => {
      try {
        const res = await userApi.getUserById();
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchUser();
  }, []);

  const transactionData = [
    { id: 1, jobGroupName: 'Công việc chuẩn bị cho sự kiện lớn vào tháng 7, cần người hỗ trợ dọn dẹp, trang trí và quản lý sự kiện', date: '25/07/2025', amount: 1050000, status: 'PENDING' },
    { id: 2, jobGroupName: 'Vị trí marketing cho chiến dịch quảng bá trong tháng 8, cần người có kinh nghiệm trong marketing online và digital', date: '20/07/2025', amount: 1200000, status: 'RELEASED' },
    { id: 3, jobGroupName: 'Trợ lý tạm thời cho công việc văn phòng, hỗ trợ quản lý hồ sơ và tài liệu', date: '15/07/2025', amount: 3300000, status: 'CANCELLED' },
    { id: 4, jobGroupName: 'Công việc bán thời gian chăm sóc khách hàng trong tháng 9, yêu cầu kỹ năng giao tiếp và xử lý khiếu nại', date: '10/07/2025', amount: 7000000, status: 'HELD' },
    { id: 5, jobGroupName: 'Công việc nhập liệu tạm thời, yêu cầu độ chính xác cao và nhanh nhẹn, làm việc với dữ liệu lớn', date: '05/07/2025', amount: 400000, status: 'RELEASED' },
    { id: 6, jobGroupName: 'Vị trí hỗ trợ hành chính cho dự án tháng 7, cần người có khả năng tổ chức công việc tốt', date: '02/07/2025', amount: 2100000, status: 'RELEASED' },
    { id: 7, jobGroupName: 'Freelancer nhiếp ảnh cho sự kiện, yêu cầu kinh nghiệm chụp hình và sáng tạo', date: '28/06/2025', amount: 1800000, status: 'CANCELLED' },
    { id: 8, jobGroupName: 'Công việc bán thời gian viết nội dung mô tả sản phẩm, yêu cầu khả năng viết sáng tạo và nhanh chóng', date: '22/06/2025', amount: 5500000, status: 'PENDING' },
    { id: 9, jobGroupName: 'Điều phối viên sự kiện tạm thời, yêu cầu kỹ năng tổ chức và làm việc dưới áp lực', date: '17/06/2025', amount: 690000, status: 'RELEASED' },
    { id: 10, jobGroupName: 'Công việc bán hàng cuối tuần, yêu cầu kỹ năng giao tiếp và thuyết phục khách hàng', date: '12/06/2025', amount: 2600000, status: 'HELD' },
    { id: 11, jobGroupName: 'Công việc kho tạm thời, yêu cầu người có khả năng làm việc chăm chỉ và quản lý kho', date: '08/06/2025', amount: 4100000, status: 'RELEASED' },
    { id: 12, jobGroupName: 'Freelancer quản lý mạng xã hội cho chiến dịch ngắn hạn, yêu cầu kỹ năng truyền thông', date: '03/06/2025', amount: 370000, status: 'PENDING' },
    { id: 13, jobGroupName: 'Công việc hành chính bán thời gian, yêu cầu khả năng tổ chức và quản lý các công việc văn phòng', date: '29/05/2025', amount: 5000000, status: 'RELEASED' },
    { id: 14, jobGroupName: 'Vị trí thiết kế đồ họa tạm thời, yêu cầu kỹ năng sử dụng phần mềm thiết kế', date: '25/05/2025', amount: 2800000, status: 'CANCELLED' },
    { id: 15, jobGroupName: 'Freelancer viết nội dung cho chiến dịch sáng tạo, yêu cầu viết sáng tạo và am hiểu SEO', date: '20/05/2025', amount: 100000, status: 'PENDING' },
    { id: 16, jobGroupName: 'Nhân viên sự kiện tạm thời, yêu cầu kỹ năng tổ chức sự kiện và hỗ trợ đội ngũ', date: '15/05/2025', amount: 3200000, status: 'RELEASED' },
  ];

  const getStatusClass = (status) => {
    if (status === 'PENDING') return 'pending';
    if (status === 'HELD') return 'held';
    if (status === 'RELEASED') return 'released';
    if (status === 'CANCELLED') return 'cancelled';
    return '';
  };

  // Quản lý phân trang
  const [currentPage, setCurrentPage] = useState(1); // Trạng thái trang hiện tại
  const pageSize = 5; // Mỗi trang hiển thị 5 dòng

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // window.scrollTo(0, 0);
    const scrollPosition = window.innerWidth <= 850 ? 480 : 220;
    window.scroll({ top: scrollPosition, left: 0, behavior: 'smooth' });
  };

  const [amountValue, setAmountValue] = useState(null);
  const [statusValue, setStatusValue] = useState(null);

  const filteredTransactions = /*transactionData*/transactions.length > 0 ? transactions.filter(item => {
    return (
      (!statusValue || item.status === statusValue) &&
      (!amountValue || (item.amount >= amountValue[0] && item.amount <= amountValue[1]))
    );
  }) : []

  const [dateFilter, setDateFilter] = useState(null);
  const convertToDate = (dateString) => {
    const [day, month, year] = dateString.split('/');
    return new Date(`${year}-${month}-${day}`); // Chuyển thành định dạng YYYY-MM-DD
  };

  const sortedTransactions = filteredTransactions.sort((a, b) => {
    const dateA = convertToDate(a.date);
    const dateB = convertToDate(b.date);

    if (dateFilter === "newest") {
      return dateB - dateA; // Sắp xếp từ mới đến cũ
    } else if (dateFilter === "oldest") {
      return dateA - dateB; // Sắp xếp từ cũ đến mới
    }
    return 0;
  });

  const paginatedData = /*filteredTransactions.*/sortedTransactions.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // nếu không có avatar
  const [noAvatar, setNoAvatar] = useState(true);

  // Modal Withdraw 
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Mở modal
  const showConfirmModal = () => {
    setConfirmVisible(true);
  };

  // Đóng modal
  const closeConfirm = () => {
    setConfirmVisible(false);
    setPreviewImage('');
  };

  const formik = useFormik({
    initialValues: {
      accountNumber: "",
      accountName: "",
      amount: "",
      bankCode: "",
    },
    validationSchema: Yup.object({
      accountNumber: Yup.string()
        .test("no-leading-space", "* No spaces at the beginning", value => !/^\s/.test(value || ""))
        .matches(/^\d+$/, "* Account Number must contain digits only")
        .required("* Required"),
      accountName: Yup.string()
        .test("no-leading-space", "* No spaces at the beginning", value => !/^\s/.test(value || ""))
        // .matches(/^[A-Za-zÀ-ỹ\s]+$/, "* Only letters and spaces are allowed")
        .matches(/^(?!.*\s{2,})[A-ZÀ-Ỹ\s]+$/, "* Only uppercase letters are allowed") // Ko cho nhập dư 2 dấu cách
        .required("* Required"),
      amount: Yup.number().required("* Required"),
      bankCode: Yup.string()
        .notOneOf(["0"], "* Bank Code must be selected")
        .required("* Required"),
    }),
    onSubmit: (values) => {
      setConfirmLoading(true);
      setTimeout(() => {
        message.success('Withdrawal request submitted successfully!');
        // Xử lý khi bấm Submit
        setConfirmLoading(false);
        setConfirmVisible(false);
        formik.resetForm();
      }, 2000);
    },
  });

  // lấy API danh sách ngân hàng
  const [bankList, setBankList] = useState([]);
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const res = await fetch('https://api.vietqr.io/v2/banks');
        const json = await res.json();
        setBankList(json.data);
      } catch (error) {
        console.error('Failed to fetch banks', error);
      }
    };
    fetchBanks();
  }, []);

  return (
    <div className='employer-transactions-container'>
      <div className="employer-transactions-top">
        <div className="employer-identity-wallet">
          {noAvatar ? (
            <p className='no-avatar'><UserOutlined /></p>
          ) : (
            <img src={avatar} />
          )}
          <div className="employer-name-money">
            <p className='employer-name'>CÔNG TY TNHH THƯƠNG MẠI & DỊCH VỤ NHÂN LỰC TRÍ VIỆT</p>
            <p className='employer-money'>Wallet Balance: {parseFloat(walletBalance).toLocaleString('vi-VN')} VND</p>
          </div>
        </div>
        <div className="employer-withdraw">
          <button onClick={showConfirmModal}>
            <PhoneOutlined rotate={90} /> Withdraw
          </button>

          <Modal
            title="Withdrawal Request"
            open={confirmVisible}
            onCancel={closeConfirm}
            footer={null}
          >
            <form onSubmit={formik.handleSubmit} className="employer-withdraw-form">
              <div className="employer-withdraw-field">
                <p><span>*</span> Account Number: </p>
                <Form.Item
                  validateStatus={formik.errors.accountNumber && formik.touched.accountNumber ? "error" : ""}
                  help={formik.errors.accountNumber && formik.touched.accountNumber ? formik.errors.accountNumber : ""}
                >
                  <Input
                    className='input'
                    placeholder="Input your Account Number..."
                    name="accountNumber"
                    value={formik.values.accountNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Form.Item>
              </div>

              <div className="employer-withdraw-field">
                <p><span>*</span> Account Name: </p>
                <Form.Item
                  validateStatus={formik.errors.accountName && formik.touched.accountName ? "error" : ""}
                  help={formik.errors.accountName && formik.touched.accountName ? formik.errors.accountName : ""}
                >
                  <Input
                    className='input'
                    placeholder="Input your Account Name..."
                    name="accountName"
                    value={formik.values.accountName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Form.Item>
              </div>
              <div className="employer-withdraw-field">
                <p><span>*</span> Bank: </p>
                <Form.Item
                  validateStatus={formik.errors.bankCode && formik.touched.bankCode ? "error" : ""}
                  help={formik.errors.bankCode && formik.touched.bankCode ? formik.errors.bankCode : ""}
                >
                  <Select
                    style={{
                      width: '100%',
                      margin: '0% 0 1%',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    placeholder="Select a Bank"
                    options={bankList.map(bank => ({
                      value: bank.shortName,
                      label: bank.shortName + " - " + bank.name,
                    }))}
                    size="large"
                    value={formik.values.bankCode || undefined}
                    onChange={(value) => formik.setFieldValue('bankCode', value || "")}
                    onBlur={() => formik.setTouched({ amount: true })}
                    allowClear
                    showSearch
                  >
                    <Select.Option value="0" disabled>
                      Select a Bank
                    </Select.Option>
                  </Select>
                </Form.Item>
              </div>

              <div className="employer-withdraw-field">
                <p><span>*</span> Amount: </p>
                <Form.Item
                  validateStatus={formik.errors.amount && formik.touched.amount ? "error" : ""}
                  help={formik.errors.amount && formik.touched.amount ? formik.errors.amount : ""}
                >
                  <InputNumber
                    className='input-number'
                    size="large"
                    placeholder="Input the amount you want to withdraw..."
                    name="amount"
                    addonAfter="VND"
                    formatter={(value) => value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    parser={(value) => value?.replace(/\./g, "")}
                    // defaultValue={1}
                    min={2000} // Không cho nhập số âm hoặc 0
                    max={walletBalance}
                    // InputNumber nhận giá trị kiểu number, trong khi formik.handleChange mặc định xử lý event.target.value. 
                    // //Vì vậy, cần dùng formik.setFieldValue thay vì formik.handleChange.
                    onChange={(value) => formik.setFieldValue("amount", value)}
                    onBlur={() => formik.setTouched({ amount: true })}
                    value={formik.values.amount}
                  />
                </Form.Item>
              </div>
              <div className="send-request-btn">
                <Button
                  type="primary"
                  onClick={formik.handleSubmit}
                  // htmlType="submit"
                  loading={confirmLoading}
                  size='large'
                >
                  Send request
                </Button>
              </div>
            </form>
          </Modal>
        </div>
      </div>

      <div className="employer-transactions-bottom">
        <h1>My transaction history</h1>

        {isLoading ? (
          <Skeleton active paragraph={{ rows: 10 }} />
        ) : /*transactionData*/transactions.length === 0 ? (
          <div className="no-transactions">
            <Empty description="You do not have a transaction yet!" />
          </div>
        ) : (
          <>
            <div className="employer-transactions-select">
              <Select
                placeholder="Filter by Date"
                value={dateFilter || 'newest'}
                onChange={(value) => {
                  setDateFilter(value);
                  setCurrentPage(1); // Reset to the first page when date filter changes
                }}
                size="large"
                // allowClear
                options={[
                  { value: 'newest', label: 'Newest' },
                  { value: 'oldest', label: 'Oldest' }
                ]}
              />
              <Select
                placeholder="Amount"
                value={amountValue ? JSON.stringify(amountValue) : null}
                onChange={(value) => {
                  if (value == null) {
                    // Nếu người dùng nhấn "clear", đặt giá trị về null
                    setAmountValue(null);
                  } else {
                    // Chuyển chuỗi JSON thành mảng
                    setAmountValue(JSON.parse(value));
                  }
                  setCurrentPage(1);
                }}
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                size="large"
                allowClear
                options={[
                  { value: JSON.stringify([0, 1999999]), label: 'Under 2 million VND' },
                  { value: JSON.stringify([2000000, 5000000]), label: 'From 2 to 5 million VND' },
                  { value: JSON.stringify([5000001, 10000000]), label: 'Over 5 to 10 million VND' },
                  { value: JSON.stringify([10000001, Number.MAX_SAFE_INTEGER]), label: 'Over 10 million VND' }
                ]}
              >
                <Select.Option value="sample">Sample</Select.Option>
              </Select>
              <Select
                placeholder="Status"
                value={statusValue}
                onChange={(value) => {
                  setStatusValue(value);
                  setCurrentPage(1);
                }}
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                size="large"
                allowClear
                options={[
                  { value: 'PENDING', label: 'PENDING' },
                  { value: 'RELEASED', label: 'RELEASED' },
                  { value: 'CANCELLED', label: 'CANCELLED' },
                ]}
              />
            </div>

            {filteredTransactions.length === 0 ? (
              <div className="no-transactions">
                <Empty description="No transactions found!" />
              </div>
            ) : (
              <>
                <div className="employer-transactions-whole-table">
                  <table className='employer-transactions-table'>
                    <thead>
                      <tr>
                        <th className='job-posting-name'>Job Group Name</th>
                        <th className='date'>Date</th>
                        <th className='amount'>Amount (VND)</th>
                        <th className='status'>Status</th>
                        <th className='detail'>Detail</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/*transactionData*/paginatedData.map(item => (
                        <tr key={item.id}>
                          <td className='job-posting-name'>{item.jobGroupName}</td>
                          <td className='date'>{item.date}</td>
                          <td className='amount'>{item.amount.toLocaleString('vi-VN')}</td>
                          <td className='status'>
                            <span className={getStatusClass(item.status)}>{item.status}</span>
                          </td>
                          <td className='detail'>
                            <Button onClick={() => navigate(`/employer/employer-transactions/employer-transaction-detail/${item.id}`, { state: item }, window.scrollTo(0, 0))}>
                              <EyeOutlined />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={filteredTransactions.length}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                  align="center"
                  showLessItems
                  showQuickJumper
                />
              </>
            )}
          </>
        )}

      </div>
    </div>
  )
}

export default EmployerTransactions